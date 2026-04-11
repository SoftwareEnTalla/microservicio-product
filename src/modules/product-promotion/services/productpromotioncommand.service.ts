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
import { ProductPromotion } from "../entities/product-promotion.entity";
import { CreateProductPromotionDto, UpdateProductPromotionDto, DeleteProductPromotionDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductPromotionCommandRepository } from "../repositories/productpromotioncommand.repository";
import { ProductPromotionQueryRepository } from "../repositories/productpromotionquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductPromotionResponse, ProductPromotionsResponse } from "../types/productpromotion.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductPromotionQueryService } from "./productpromotionquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductPromotionCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductPromotionCommandService.name);
  //Constructo del servicio ProductPromotionCommandService
  constructor(
    private readonly repository: ProductPromotionCommandRepository,
    private readonly queryRepository: ProductPromotionQueryRepository,
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
      .registerClient(ProductPromotionQueryService.name)
      .get(ProductPromotionQueryService.name),
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
        await this.eventStore.appendEvent('product-promotion-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductPromotion | null,
    current?: ProductPromotion | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: promotion-must-have-price-effect
      // Toda promoción debe definir algún efecto económico.
      if (!(this.dslValue(entityData, currentData, inputData, 'discountPercent') === undefined || this.dslValue(entityData, currentData, inputData, 'discountPercent') === null || (typeof this.dslValue(entityData, currentData, inputData, 'discountPercent') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'discountPercent')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'discountPercent')) && this.dslValue(entityData, currentData, inputData, 'discountPercent').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'discountPercent') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'discountPercent')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'discountPercent')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'discountPercent'))).length === 0))) {
        logger.warn('PRODUCT_PROMOTION_001: Verificar que la promoción tenga descuento porcentual, fijo o precio especial');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: promotion-must-have-price-effect
      // Toda promoción debe definir algún efecto económico.
      if (!(this.dslValue(entityData, currentData, inputData, 'discountPercent') === undefined || this.dslValue(entityData, currentData, inputData, 'discountPercent') === null || (typeof this.dslValue(entityData, currentData, inputData, 'discountPercent') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'discountPercent')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'discountPercent')) && this.dslValue(entityData, currentData, inputData, 'discountPercent').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'discountPercent') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'discountPercent')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'discountPercent')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'discountPercent'))).length === 0))) {
        logger.warn('PRODUCT_PROMOTION_001: Verificar que la promoción tenga descuento porcentual, fijo o precio especial');
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
      .registerClient(ProductPromotionCommandService.name)
      .get(ProductPromotionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductPromotionDto>("createProductPromotion", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductPromotionDtoInput: CreateProductPromotionDto
  ): Promise<ProductPromotionResponse<ProductPromotion>> {
    try {
      logger.info("Receiving in service:", createProductPromotionDtoInput);
      const candidate = ProductPromotion.fromDto(createProductPromotionDtoInput);
      await this.applyDslServiceRules("create", createProductPromotionDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductPromotionDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productpromotion no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductPromotion no encontrada.");
      // Devolver productpromotion
      return {
        ok: true,
        message: "ProductPromotion obtenido con éxito.",
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
      .registerClient(ProductPromotionCommandService.name)
      .get(ProductPromotionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductPromotion>("createProductPromotions", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductPromotionDtosInput: CreateProductPromotionDto[]
  ): Promise<ProductPromotionsResponse<ProductPromotion>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductPromotionDtosInput.map((entity) => ProductPromotion.fromDto(entity))
      );

      // Respuesta si el productpromotion no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductPromotions no encontradas.");
      // Devolver productpromotion
      return {
        ok: true,
        message: "ProductPromotions creados con éxito.",
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
      .registerClient(ProductPromotionCommandService.name)
      .get(ProductPromotionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductPromotionDto>("updateProductPromotion", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductPromotionDto
  ): Promise<ProductPromotionResponse<ProductPromotion>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductPromotion(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productpromotion no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductPromotions no encontradas.");
      // Devolver productpromotion
      return {
        ok: true,
        message: "ProductPromotion actualizada con éxito.",
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
      .registerClient(ProductPromotionCommandService.name)
      .get(ProductPromotionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductPromotionDto>("updateProductPromotions", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductPromotionDto[]
  ): Promise<ProductPromotionsResponse<ProductPromotion>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductPromotion.fromDto(entity))
      );
      // Respuesta si el productpromotion no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductPromotions no encontradas.");
      // Devolver productpromotion
      return {
        ok: true,
        message: "ProductPromotions actualizadas con éxito.",
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
      .registerClient(ProductPromotionCommandService.name)
      .get(ProductPromotionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductPromotionDto>("deleteProductPromotion", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductPromotionResponse<ProductPromotion>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productpromotion no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductPromotion no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productpromotion
      return {
        ok: true,
        message: "Instancia de ProductPromotion eliminada con éxito.",
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
      .registerClient(ProductPromotionCommandService.name)
      .get(ProductPromotionCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductPromotions", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

