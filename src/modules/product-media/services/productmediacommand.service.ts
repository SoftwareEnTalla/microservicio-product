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
import { ProductMedia } from "../entities/product-media.entity";
import { CreateProductMediaDto, UpdateProductMediaDto, DeleteProductMediaDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductMediaCommandRepository } from "../repositories/productmediacommand.repository";
import { ProductMediaQueryRepository } from "../repositories/productmediaquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductMediaResponse, ProductMediasResponse } from "../types/productmedia.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductMediaQueryService } from "./productmediaquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductMediaCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductMediaCommandService.name);
  //Constructo del servicio ProductMediaCommandService
  constructor(
    private readonly repository: ProductMediaCommandRepository,
    private readonly queryRepository: ProductMediaQueryRepository,
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
      .registerClient(ProductMediaQueryService.name)
      .get(ProductMediaQueryService.name),
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
        await this.eventStore.appendEvent('product-media-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductMedia | null,
    current?: ProductMedia | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: product-media-url-required
      // Todo recurso de media debe tener una URL válida.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'url') === undefined || this.dslValue(entityData, currentData, inputData, 'url') === null || (typeof this.dslValue(entityData, currentData, inputData, 'url') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'url')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'url')) && this.dslValue(entityData, currentData, inputData, 'url').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'url') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'url')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'url')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'url'))).length === 0)))) {
        throw new Error('PRODUCT_MEDIA_001: La media requiere una URL o referencia válida');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: product-media-url-required
      // Todo recurso de media debe tener una URL válida.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'url') === undefined || this.dslValue(entityData, currentData, inputData, 'url') === null || (typeof this.dslValue(entityData, currentData, inputData, 'url') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'url')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'url')) && this.dslValue(entityData, currentData, inputData, 'url').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'url') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'url')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'url')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'url'))).length === 0)))) {
        throw new Error('PRODUCT_MEDIA_001: La media requiere una URL o referencia válida');
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
      .registerClient(ProductMediaCommandService.name)
      .get(ProductMediaCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductMediaDto>("createProductMedia", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductMediaDtoInput: CreateProductMediaDto
  ): Promise<ProductMediaResponse<ProductMedia>> {
    try {
      logger.info("Receiving in service:", createProductMediaDtoInput);
      const candidate = ProductMedia.fromDto(createProductMediaDtoInput);
      await this.applyDslServiceRules("create", createProductMediaDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductMediaDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productmedia no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductMedia no encontrada.");
      // Devolver productmedia
      return {
        ok: true,
        message: "ProductMedia obtenido con éxito.",
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
      .registerClient(ProductMediaCommandService.name)
      .get(ProductMediaCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductMedia>("createProductMedias", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductMediaDtosInput: CreateProductMediaDto[]
  ): Promise<ProductMediasResponse<ProductMedia>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductMediaDtosInput.map((entity) => ProductMedia.fromDto(entity))
      );

      // Respuesta si el productmedia no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductMedias no encontradas.");
      // Devolver productmedia
      return {
        ok: true,
        message: "ProductMedias creados con éxito.",
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
      .registerClient(ProductMediaCommandService.name)
      .get(ProductMediaCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductMediaDto>("updateProductMedia", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductMediaDto
  ): Promise<ProductMediaResponse<ProductMedia>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductMedia(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productmedia no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductMedias no encontradas.");
      // Devolver productmedia
      return {
        ok: true,
        message: "ProductMedia actualizada con éxito.",
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
      .registerClient(ProductMediaCommandService.name)
      .get(ProductMediaCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductMediaDto>("updateProductMedias", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductMediaDto[]
  ): Promise<ProductMediasResponse<ProductMedia>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductMedia.fromDto(entity))
      );
      // Respuesta si el productmedia no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductMedias no encontradas.");
      // Devolver productmedia
      return {
        ok: true,
        message: "ProductMedias actualizadas con éxito.",
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
      .registerClient(ProductMediaCommandService.name)
      .get(ProductMediaCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductMediaDto>("deleteProductMedia", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductMediaResponse<ProductMedia>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productmedia no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductMedia no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productmedia
      return {
        ok: true,
        message: "Instancia de ProductMedia eliminada con éxito.",
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
      .registerClient(ProductMediaCommandService.name)
      .get(ProductMediaCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductMedias", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

