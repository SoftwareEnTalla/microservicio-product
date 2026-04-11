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
import { ProductAttribute } from "../entities/product-attribute.entity";
import { CreateProductAttributeDto, UpdateProductAttributeDto, DeleteProductAttributeDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductAttributeCommandRepository } from "../repositories/productattributecommand.repository";
import { ProductAttributeQueryRepository } from "../repositories/productattributequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductAttributeResponse, ProductAttributesResponse } from "../types/productattribute.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductAttributeQueryService } from "./productattributequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductAttributeCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductAttributeCommandService.name);
  //Constructo del servicio ProductAttributeCommandService
  constructor(
    private readonly repository: ProductAttributeCommandRepository,
    private readonly queryRepository: ProductAttributeQueryRepository,
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
      .registerClient(ProductAttributeQueryService.name)
      .get(ProductAttributeQueryService.name),
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
        await this.eventStore.appendEvent('product-attribute-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductAttribute | null,
    current?: ProductAttribute | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: product-attribute-code-required
      // Todo atributo dinámico requiere un código único.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'code') === undefined || this.dslValue(entityData, currentData, inputData, 'code') === null || (typeof this.dslValue(entityData, currentData, inputData, 'code') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'code')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'code')) && this.dslValue(entityData, currentData, inputData, 'code').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'code') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'code')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'code')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'code'))).length === 0)))) {
        throw new Error('PRODUCT_ATTRIBUTE_001: El atributo requiere código');
      }

      // Regla de servicio: enum-attribute-must-define-options
      // Los atributos enum deben declarar opciones.
      if (!(this.dslValue(entityData, currentData, inputData, 'dataType') === 'ENUM' && !(this.dslValue(entityData, currentData, inputData, 'enumOptions') === undefined || this.dslValue(entityData, currentData, inputData, 'enumOptions') === null || (typeof this.dslValue(entityData, currentData, inputData, 'enumOptions') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'enumOptions')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'enumOptions')) && this.dslValue(entityData, currentData, inputData, 'enumOptions').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'enumOptions') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'enumOptions')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'enumOptions')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'enumOptions'))).length === 0)))) {
        throw new Error('PRODUCT_ATTRIBUTE_002: Los atributos enum requieren opciones configuradas');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: product-attribute-code-required
      // Todo atributo dinámico requiere un código único.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'code') === undefined || this.dslValue(entityData, currentData, inputData, 'code') === null || (typeof this.dslValue(entityData, currentData, inputData, 'code') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'code')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'code')) && this.dslValue(entityData, currentData, inputData, 'code').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'code') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'code')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'code')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'code'))).length === 0)))) {
        throw new Error('PRODUCT_ATTRIBUTE_001: El atributo requiere código');
      }

      // Regla de servicio: enum-attribute-must-define-options
      // Los atributos enum deben declarar opciones.
      if (!(this.dslValue(entityData, currentData, inputData, 'dataType') === 'ENUM' && !(this.dslValue(entityData, currentData, inputData, 'enumOptions') === undefined || this.dslValue(entityData, currentData, inputData, 'enumOptions') === null || (typeof this.dslValue(entityData, currentData, inputData, 'enumOptions') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'enumOptions')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'enumOptions')) && this.dslValue(entityData, currentData, inputData, 'enumOptions').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'enumOptions') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'enumOptions')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'enumOptions')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'enumOptions'))).length === 0)))) {
        throw new Error('PRODUCT_ATTRIBUTE_002: Los atributos enum requieren opciones configuradas');
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
      .registerClient(ProductAttributeCommandService.name)
      .get(ProductAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductAttributeDto>("createProductAttribute", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductAttributeDtoInput: CreateProductAttributeDto
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
    try {
      logger.info("Receiving in service:", createProductAttributeDtoInput);
      const candidate = ProductAttribute.fromDto(createProductAttributeDtoInput);
      await this.applyDslServiceRules("create", createProductAttributeDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductAttributeDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productattribute no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductAttribute no encontrada.");
      // Devolver productattribute
      return {
        ok: true,
        message: "ProductAttribute obtenido con éxito.",
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
      .registerClient(ProductAttributeCommandService.name)
      .get(ProductAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductAttribute>("createProductAttributes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductAttributeDtosInput: CreateProductAttributeDto[]
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductAttributeDtosInput.map((entity) => ProductAttribute.fromDto(entity))
      );

      // Respuesta si el productattribute no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductAttributes no encontradas.");
      // Devolver productattribute
      return {
        ok: true,
        message: "ProductAttributes creados con éxito.",
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
      .registerClient(ProductAttributeCommandService.name)
      .get(ProductAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductAttributeDto>("updateProductAttribute", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductAttributeDto
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductAttribute(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productattribute no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductAttributes no encontradas.");
      // Devolver productattribute
      return {
        ok: true,
        message: "ProductAttribute actualizada con éxito.",
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
      .registerClient(ProductAttributeCommandService.name)
      .get(ProductAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductAttributeDto>("updateProductAttributes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductAttributeDto[]
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductAttribute.fromDto(entity))
      );
      // Respuesta si el productattribute no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductAttributes no encontradas.");
      // Devolver productattribute
      return {
        ok: true,
        message: "ProductAttributes actualizadas con éxito.",
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
      .registerClient(ProductAttributeCommandService.name)
      .get(ProductAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductAttributeDto>("deleteProductAttribute", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductAttributeResponse<ProductAttribute>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productattribute no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductAttribute no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productattribute
      return {
        ok: true,
        message: "Instancia de ProductAttribute eliminada con éxito.",
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
      .registerClient(ProductAttributeCommandService.name)
      .get(ProductAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductAttributes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

