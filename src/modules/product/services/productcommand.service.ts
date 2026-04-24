/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { Product } from "../entities/product.entity";
import { CreateProductDto, UpdateProductDto, DeleteProductDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductCommandRepository } from "../repositories/productcommand.repository";
import { ProductQueryRepository } from "../repositories/productquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductResponse, ProductsResponse } from "../types/product.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductQueryService } from "./productquery.service";
import { BaseEvent } from "../events/base.event";
import { ProductActivatedEvent } from '../events/productactivated.event';
import { ProductEmbeddingUpdatedEvent } from '../events/productembeddingupdated.event';
import { SemanticSearchService } from "src/shared/semantic-search/semantic-search.service";

@Injectable()
export class ProductCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductCommandService.name);
  //Constructo del servicio ProductCommandService
  constructor(
    private readonly repository: ProductCommandRepository,
    private readonly queryRepository: ProductQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef,
    private readonly semanticSearch: SemanticSearchService,
  ) {
    //Inicialice aquí propiedades o atributos
  }

  private buildSemanticSourceText(entity: Product): string {
    const parts: string[] = [];
    const push = (v: any) => { if (v !== undefined && v !== null && String(v).trim() !== '') parts.push(String(v)); };
    push((entity as any).name);
    push((entity as any).code);
    push((entity as any).slug);
    push((entity as any).shortDescription);
    push((entity as any).longDescription);
    push((entity as any).description);
    const keywords = (entity as any).keywords;
    if (Array.isArray(keywords)) push(keywords.join(' '));
    const tags = (entity as any).tags;
    if (Array.isArray(tags)) push(tags.join(' '));
    const metadata = (entity as any).metadata;
    if (metadata && typeof metadata === 'object') {
      try { push(JSON.stringify(metadata)); } catch { /* noop */ }
    }
    return parts.join(' \n ');
  }

  private async refreshSemanticEmbedding(entity: Product): Promise<void> {
    if (!entity) return;
    try {
      const source = this.buildSemanticSourceText(entity);
      if (!source.trim()) return;
      const embedding = await this.semanticSearch.computeEmbedding(source);
      const now = new Date();
      (entity as any).semanticEmbedding = embedding;
      (entity as any).semanticEmbeddingUpdatedAt = now;
      await this.repository.update(entity.id, {
        semanticEmbedding: embedding as any,
        semanticEmbeddingUpdatedAt: now as any,
      } as any);
      await this.publishDslDomainEvents([
        ProductEmbeddingUpdatedEvent.create(
          entity.id,
          entity,
          (entity as any).updatedBy || 'system',
        ),
      ]);
    } catch (err) {
      this.#logger.warn(`No se pudo actualizar semanticEmbedding del product ${entity?.id}: ${(err as Error)?.message}`);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('product-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Product | null,
    current?: Product | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: active-product-must-have-media
      // Un producto activo requiere al menos una imagen.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE')) {
        throw new Error('PRODUCT_001: El producto activo requiere media visual mínima');
      }

      // Regla de servicio: public-product-must-be-active
      // Un producto público debe estar activo.
      if (!(this.dslValue(entityData, currentData, inputData, 'visibility') === 'PUBLIC' && this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE')) {
        throw new Error('PRODUCT_002: La visibilidad pública exige estado activo');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: active-product-must-have-media
      // Un producto activo requiere al menos una imagen.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE')) {
        throw new Error('PRODUCT_001: El producto activo requiere media visual mínima');
      }

      // Regla de servicio: public-product-must-be-active
      // Un producto público debe estar activo.
      if (!(this.dslValue(entityData, currentData, inputData, 'visibility') === 'PUBLIC' && this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE')) {
        throw new Error('PRODUCT_002: La visibilidad pública exige estado activo');
      }

      // Regla de servicio: product-activation-emits-event
      // La activación del producto debe emitir evento de dominio.
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE') {
        pendingEvents.push(ProductActivatedEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'product-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'product-update')
        ));
      }

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductCommandService.name)
      .get(ProductCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductDto>("createProduct", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductDtoInput: CreateProductDto
  ): Promise<ProductResponse<Product>> {
    try {
      logger.info("Receiving in service:", createProductDtoInput);
      const candidate = Product.fromDto(createProductDtoInput);
      await this.applyDslServiceRules("create", createProductDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductDtoInput as Record<string, any>, entity, null, true);
      if (entity) {
        await this.refreshSemanticEmbedding(entity);
      }
      logger.info("Entity created on service:", entity);
      // Respuesta si el product no existe
      if (!entity)
        throw new NotFoundException("Entidad Product no encontrada.");
      // Devolver product
      return {
        ok: true,
        message: "Product obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductCommandService.name)
      .get(ProductCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Product>("createProducts", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductDtosInput: CreateProductDto[]
  ): Promise<ProductsResponse<Product>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductDtosInput.map((entity) => Product.fromDto(entity))
      );

      // Respuesta si el product no existe
      if (!entities)
        throw new NotFoundException("Entidades Products no encontradas.");
      // Devolver product
      return {
        ok: true,
        message: "Products creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductCommandService.name)
      .get(ProductCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductDto>("updateProduct", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductDto
  ): Promise<ProductResponse<Product>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Product(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el product no existe
      if (!entity)
        throw new NotFoundException("Entidades Products no encontradas.");
      const semanticRelevantFields = ['name','code','slug','shortDescription','longDescription','description','keywords','tags','metadata'];
      const touched = Object.keys(partialEntity || {}).some(k => semanticRelevantFields.includes(k));
      if (touched) {
        await this.refreshSemanticEmbedding(entity);
      }
      // Devolver product
      return {
        ok: true,
        message: "Product actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductCommandService.name)
      .get(ProductCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductDto>("updateProducts", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductDto[]
  ): Promise<ProductsResponse<Product>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Product.fromDto(entity))
      );
      // Respuesta si el product no existe
      if (!entities)
        throw new NotFoundException("Entidades Products no encontradas.");
      // Devolver product
      return {
        ok: true,
        message: "Products actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductCommandService.name)
      .get(ProductCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductDto>("deleteProduct", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductResponse<Product>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el product no existe
      if (!entity)
        throw new NotFoundException("Instancias de Product no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver product
      return {
        ok: true,
        message: "Instancia de Product eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductCommandService.name)
      .get(ProductCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProducts", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

