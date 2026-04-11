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
import { ProductRelationship } from "../entities/product-relationship.entity";
import { CreateProductRelationshipDto, UpdateProductRelationshipDto, DeleteProductRelationshipDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductRelationshipCommandRepository } from "../repositories/productrelationshipcommand.repository";
import { ProductRelationshipQueryRepository } from "../repositories/productrelationshipquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductRelationshipResponse, ProductRelationshipsResponse } from "../types/productrelationship.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductRelationshipQueryService } from "./productrelationshipquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductRelationshipCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductRelationshipCommandService.name);
  //Constructo del servicio ProductRelationshipCommandService
  constructor(
    private readonly repository: ProductRelationshipCommandRepository,
    private readonly queryRepository: ProductRelationshipQueryRepository,
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
      .registerClient(ProductRelationshipQueryService.name)
      .get(ProductRelationshipQueryService.name),
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
        await this.eventStore.appendEvent('product-relationship-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductRelationship | null,
    current?: ProductRelationship | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: product-cannot-relate-to-itself
      // Un producto no debe relacionarse consigo mismo.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'sourceProductId') === undefined || this.dslValue(entityData, currentData, inputData, 'sourceProductId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'sourceProductId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'sourceProductId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceProductId')) && this.dslValue(entityData, currentData, inputData, 'sourceProductId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'sourceProductId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceProductId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'sourceProductId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'sourceProductId'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'targetProductId') === undefined || this.dslValue(entityData, currentData, inputData, 'targetProductId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'targetProductId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'targetProductId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'targetProductId')) && this.dslValue(entityData, currentData, inputData, 'targetProductId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'targetProductId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'targetProductId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'targetProductId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'targetProductId'))).length === 0)))) {
        throw new Error('PRODUCT_RELATIONSHIP_001: La relación debe vincular productos distintos');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: product-cannot-relate-to-itself
      // Un producto no debe relacionarse consigo mismo.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'sourceProductId') === undefined || this.dslValue(entityData, currentData, inputData, 'sourceProductId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'sourceProductId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'sourceProductId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceProductId')) && this.dslValue(entityData, currentData, inputData, 'sourceProductId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'sourceProductId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceProductId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'sourceProductId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'sourceProductId'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'targetProductId') === undefined || this.dslValue(entityData, currentData, inputData, 'targetProductId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'targetProductId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'targetProductId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'targetProductId')) && this.dslValue(entityData, currentData, inputData, 'targetProductId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'targetProductId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'targetProductId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'targetProductId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'targetProductId'))).length === 0)))) {
        throw new Error('PRODUCT_RELATIONSHIP_001: La relación debe vincular productos distintos');
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
      .registerClient(ProductRelationshipCommandService.name)
      .get(ProductRelationshipCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductRelationshipDto>("createProductRelationship", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductRelationshipDtoInput: CreateProductRelationshipDto
  ): Promise<ProductRelationshipResponse<ProductRelationship>> {
    try {
      logger.info("Receiving in service:", createProductRelationshipDtoInput);
      const candidate = ProductRelationship.fromDto(createProductRelationshipDtoInput);
      await this.applyDslServiceRules("create", createProductRelationshipDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductRelationshipDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productrelationship no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductRelationship no encontrada.");
      // Devolver productrelationship
      return {
        ok: true,
        message: "ProductRelationship obtenido con éxito.",
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
      .registerClient(ProductRelationshipCommandService.name)
      .get(ProductRelationshipCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductRelationship>("createProductRelationships", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductRelationshipDtosInput: CreateProductRelationshipDto[]
  ): Promise<ProductRelationshipsResponse<ProductRelationship>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductRelationshipDtosInput.map((entity) => ProductRelationship.fromDto(entity))
      );

      // Respuesta si el productrelationship no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductRelationships no encontradas.");
      // Devolver productrelationship
      return {
        ok: true,
        message: "ProductRelationships creados con éxito.",
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
      .registerClient(ProductRelationshipCommandService.name)
      .get(ProductRelationshipCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductRelationshipDto>("updateProductRelationship", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductRelationshipDto
  ): Promise<ProductRelationshipResponse<ProductRelationship>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductRelationship(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productrelationship no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductRelationships no encontradas.");
      // Devolver productrelationship
      return {
        ok: true,
        message: "ProductRelationship actualizada con éxito.",
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
      .registerClient(ProductRelationshipCommandService.name)
      .get(ProductRelationshipCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductRelationshipDto>("updateProductRelationships", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductRelationshipDto[]
  ): Promise<ProductRelationshipsResponse<ProductRelationship>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductRelationship.fromDto(entity))
      );
      // Respuesta si el productrelationship no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductRelationships no encontradas.");
      // Devolver productrelationship
      return {
        ok: true,
        message: "ProductRelationships actualizadas con éxito.",
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
      .registerClient(ProductRelationshipCommandService.name)
      .get(ProductRelationshipCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductRelationshipDto>("deleteProductRelationship", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductRelationshipResponse<ProductRelationship>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productrelationship no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductRelationship no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productrelationship
      return {
        ok: true,
        message: "Instancia de ProductRelationship eliminada con éxito.",
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
      .registerClient(ProductRelationshipCommandService.name)
      .get(ProductRelationshipCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductRelationships", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

