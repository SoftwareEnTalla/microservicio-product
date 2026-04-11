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
import { ProductVariant } from "../entities/product-variant.entity";
import { CreateProductVariantDto, UpdateProductVariantDto, DeleteProductVariantDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductVariantCommandRepository } from "../repositories/productvariantcommand.repository";
import { ProductVariantQueryRepository } from "../repositories/productvariantquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductVariantResponse, ProductVariantsResponse } from "../types/productvariant.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductVariantQueryService } from "./productvariantquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductVariantCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductVariantCommandService.name);
  //Constructo del servicio ProductVariantCommandService
  constructor(
    private readonly repository: ProductVariantCommandRepository,
    private readonly queryRepository: ProductVariantQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
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
      .registerClient(ProductVariantQueryService.name)
      .get(ProductVariantQueryService.name),
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
        await this.eventStore.appendEvent('product-variant-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductVariant | null,
    current?: ProductVariant | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: variant-must-reference-product
      // Toda variante debe referenciar un producto padre.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'productId') === undefined || this.dslValue(entityData, currentData, inputData, 'productId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'productId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'productId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'productId')) && this.dslValue(entityData, currentData, inputData, 'productId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'productId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'productId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'productId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'productId'))).length === 0)))) {
        throw new Error('PRODUCT_VARIANT_001: La variante requiere productId');
      }

      // Regla de servicio: variant-sku-required
      // Toda variante vendible debe tener SKU.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'sku') === undefined || this.dslValue(entityData, currentData, inputData, 'sku') === null || (typeof this.dslValue(entityData, currentData, inputData, 'sku') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'sku')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'sku')) && this.dslValue(entityData, currentData, inputData, 'sku').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'sku') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'sku')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'sku')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'sku'))).length === 0)))) {
        throw new Error('PRODUCT_VARIANT_002: La variante requiere SKU único');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: variant-must-reference-product
      // Toda variante debe referenciar un producto padre.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'productId') === undefined || this.dslValue(entityData, currentData, inputData, 'productId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'productId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'productId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'productId')) && this.dslValue(entityData, currentData, inputData, 'productId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'productId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'productId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'productId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'productId'))).length === 0)))) {
        throw new Error('PRODUCT_VARIANT_001: La variante requiere productId');
      }

      // Regla de servicio: variant-sku-required
      // Toda variante vendible debe tener SKU.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'sku') === undefined || this.dslValue(entityData, currentData, inputData, 'sku') === null || (typeof this.dslValue(entityData, currentData, inputData, 'sku') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'sku')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'sku')) && this.dslValue(entityData, currentData, inputData, 'sku').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'sku') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'sku')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'sku')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'sku'))).length === 0)))) {
        throw new Error('PRODUCT_VARIANT_002: La variante requiere SKU único');
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
      .registerClient(ProductVariantCommandService.name)
      .get(ProductVariantCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductVariantDto>("createProductVariant", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductVariantDtoInput: CreateProductVariantDto
  ): Promise<ProductVariantResponse<ProductVariant>> {
    try {
      logger.info("Receiving in service:", createProductVariantDtoInput);
      const candidate = ProductVariant.fromDto(createProductVariantDtoInput);
      await this.applyDslServiceRules("create", createProductVariantDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductVariantDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productvariant no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductVariant no encontrada.");
      // Devolver productvariant
      return {
        ok: true,
        message: "ProductVariant obtenido con éxito.",
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
      .registerClient(ProductVariantCommandService.name)
      .get(ProductVariantCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductVariant>("createProductVariants", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductVariantDtosInput: CreateProductVariantDto[]
  ): Promise<ProductVariantsResponse<ProductVariant>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductVariantDtosInput.map((entity) => ProductVariant.fromDto(entity))
      );

      // Respuesta si el productvariant no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductVariants no encontradas.");
      // Devolver productvariant
      return {
        ok: true,
        message: "ProductVariants creados con éxito.",
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
      .registerClient(ProductVariantCommandService.name)
      .get(ProductVariantCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductVariantDto>("updateProductVariant", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductVariantDto
  ): Promise<ProductVariantResponse<ProductVariant>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductVariant(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productvariant no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductVariants no encontradas.");
      // Devolver productvariant
      return {
        ok: true,
        message: "ProductVariant actualizada con éxito.",
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
      .registerClient(ProductVariantCommandService.name)
      .get(ProductVariantCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductVariantDto>("updateProductVariants", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductVariantDto[]
  ): Promise<ProductVariantsResponse<ProductVariant>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductVariant.fromDto(entity))
      );
      // Respuesta si el productvariant no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductVariants no encontradas.");
      // Devolver productvariant
      return {
        ok: true,
        message: "ProductVariants actualizadas con éxito.",
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
      .registerClient(ProductVariantCommandService.name)
      .get(ProductVariantCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductVariantDto>("deleteProductVariant", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductVariantResponse<ProductVariant>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productvariant no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductVariant no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productvariant
      return {
        ok: true,
        message: "Instancia de ProductVariant eliminada con éxito.",
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
      .registerClient(ProductVariantCommandService.name)
      .get(ProductVariantCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductVariants", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

