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
import { ProductSpecification } from "../entities/product-specification.entity";
import { CreateProductSpecificationDto, UpdateProductSpecificationDto, DeleteProductSpecificationDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductSpecificationCommandRepository } from "../repositories/productspecificationcommand.repository";
import { ProductSpecificationQueryRepository } from "../repositories/productspecificationquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductSpecificationResponse, ProductSpecificationsResponse } from "../types/productspecification.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductSpecificationQueryService } from "./productspecificationquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductSpecificationCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductSpecificationCommandService.name);
  //Constructo del servicio ProductSpecificationCommandService
  constructor(
    private readonly repository: ProductSpecificationCommandRepository,
    private readonly queryRepository: ProductSpecificationQueryRepository,
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
      .registerClient(ProductSpecificationQueryService.name)
      .get(ProductSpecificationQueryService.name),
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
        await this.eventStore.appendEvent('product-specification-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductSpecification | null,
    current?: ProductSpecification | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: product-specification-key-required
      // Toda especificación requiere clave y valor.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'specKey') === undefined || this.dslValue(entityData, currentData, inputData, 'specKey') === null || (typeof this.dslValue(entityData, currentData, inputData, 'specKey') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'specKey')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'specKey')) && this.dslValue(entityData, currentData, inputData, 'specKey').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'specKey') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'specKey')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'specKey')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'specKey'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'value') === undefined || this.dslValue(entityData, currentData, inputData, 'value') === null || (typeof this.dslValue(entityData, currentData, inputData, 'value') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'value')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'value')) && this.dslValue(entityData, currentData, inputData, 'value').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'value') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'value')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'value')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'value'))).length === 0)))) {
        throw new Error('PRODUCT_SPECIFICATION_001: La especificación requiere clave y valor');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: product-specification-key-required
      // Toda especificación requiere clave y valor.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'specKey') === undefined || this.dslValue(entityData, currentData, inputData, 'specKey') === null || (typeof this.dslValue(entityData, currentData, inputData, 'specKey') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'specKey')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'specKey')) && this.dslValue(entityData, currentData, inputData, 'specKey').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'specKey') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'specKey')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'specKey')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'specKey'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'value') === undefined || this.dslValue(entityData, currentData, inputData, 'value') === null || (typeof this.dslValue(entityData, currentData, inputData, 'value') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'value')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'value')) && this.dslValue(entityData, currentData, inputData, 'value').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'value') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'value')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'value')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'value'))).length === 0)))) {
        throw new Error('PRODUCT_SPECIFICATION_001: La especificación requiere clave y valor');
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
      .registerClient(ProductSpecificationCommandService.name)
      .get(ProductSpecificationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductSpecificationDto>("createProductSpecification", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductSpecificationDtoInput: CreateProductSpecificationDto
  ): Promise<ProductSpecificationResponse<ProductSpecification>> {
    try {
      logger.info("Receiving in service:", createProductSpecificationDtoInput);
      const candidate = ProductSpecification.fromDto(createProductSpecificationDtoInput);
      await this.applyDslServiceRules("create", createProductSpecificationDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductSpecificationDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productspecification no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductSpecification no encontrada.");
      // Devolver productspecification
      return {
        ok: true,
        message: "ProductSpecification obtenido con éxito.",
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
      .registerClient(ProductSpecificationCommandService.name)
      .get(ProductSpecificationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductSpecification>("createProductSpecifications", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductSpecificationDtosInput: CreateProductSpecificationDto[]
  ): Promise<ProductSpecificationsResponse<ProductSpecification>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductSpecificationDtosInput.map((entity) => ProductSpecification.fromDto(entity))
      );

      // Respuesta si el productspecification no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductSpecifications no encontradas.");
      // Devolver productspecification
      return {
        ok: true,
        message: "ProductSpecifications creados con éxito.",
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
      .registerClient(ProductSpecificationCommandService.name)
      .get(ProductSpecificationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductSpecificationDto>("updateProductSpecification", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductSpecificationDto
  ): Promise<ProductSpecificationResponse<ProductSpecification>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductSpecification(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productspecification no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductSpecifications no encontradas.");
      // Devolver productspecification
      return {
        ok: true,
        message: "ProductSpecification actualizada con éxito.",
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
      .registerClient(ProductSpecificationCommandService.name)
      .get(ProductSpecificationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductSpecificationDto>("updateProductSpecifications", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductSpecificationDto[]
  ): Promise<ProductSpecificationsResponse<ProductSpecification>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductSpecification.fromDto(entity))
      );
      // Respuesta si el productspecification no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductSpecifications no encontradas.");
      // Devolver productspecification
      return {
        ok: true,
        message: "ProductSpecifications actualizadas con éxito.",
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
      .registerClient(ProductSpecificationCommandService.name)
      .get(ProductSpecificationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductSpecificationDto>("deleteProductSpecification", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductSpecificationResponse<ProductSpecification>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productspecification no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductSpecification no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productspecification
      return {
        ok: true,
        message: "Instancia de ProductSpecification eliminada con éxito.",
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
      .registerClient(ProductSpecificationCommandService.name)
      .get(ProductSpecificationCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductSpecifications", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

