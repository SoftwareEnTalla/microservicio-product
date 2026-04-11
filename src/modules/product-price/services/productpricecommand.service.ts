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
import { ProductPrice } from "../entities/product-price.entity";
import { CreateProductPriceDto, UpdateProductPriceDto, DeleteProductPriceDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductPriceCommandRepository } from "../repositories/productpricecommand.repository";
import { ProductPriceQueryRepository } from "../repositories/productpricequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductPriceResponse, ProductPricesResponse } from "../types/productprice.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductPriceQueryService } from "./productpricequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductPriceCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductPriceCommandService.name);
  //Constructo del servicio ProductPriceCommandService
  constructor(
    private readonly repository: ProductPriceCommandRepository,
    private readonly queryRepository: ProductPriceQueryRepository,
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
      .registerClient(ProductPriceQueryService.name)
      .get(ProductPriceQueryService.name),
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
        await this.eventStore.appendEvent('product-price-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductPrice | null,
    current?: ProductPrice | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: product-price-amount-must-be-positive
      // Todo precio debe tener monto positivo.
      if (!((this.dslValue(entityData, currentData, inputData, 'amount') === undefined || this.dslValue(entityData, currentData, inputData, 'amount') === null || this.dslValue(entityData, currentData, inputData, 'amount') > 0))) {
        throw new Error('PRODUCT_PRICE_001: El monto del precio debe ser mayor que cero');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: product-price-amount-must-be-positive
      // Todo precio debe tener monto positivo.
      if (!((this.dslValue(entityData, currentData, inputData, 'amount') === undefined || this.dslValue(entityData, currentData, inputData, 'amount') === null || this.dslValue(entityData, currentData, inputData, 'amount') > 0))) {
        throw new Error('PRODUCT_PRICE_001: El monto del precio debe ser mayor que cero');
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
      .registerClient(ProductPriceCommandService.name)
      .get(ProductPriceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductPriceDto>("createProductPrice", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductPriceDtoInput: CreateProductPriceDto
  ): Promise<ProductPriceResponse<ProductPrice>> {
    try {
      logger.info("Receiving in service:", createProductPriceDtoInput);
      const candidate = ProductPrice.fromDto(createProductPriceDtoInput);
      await this.applyDslServiceRules("create", createProductPriceDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductPriceDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productprice no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductPrice no encontrada.");
      // Devolver productprice
      return {
        ok: true,
        message: "ProductPrice obtenido con éxito.",
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
      .registerClient(ProductPriceCommandService.name)
      .get(ProductPriceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductPrice>("createProductPrices", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductPriceDtosInput: CreateProductPriceDto[]
  ): Promise<ProductPricesResponse<ProductPrice>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductPriceDtosInput.map((entity) => ProductPrice.fromDto(entity))
      );

      // Respuesta si el productprice no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductPrices no encontradas.");
      // Devolver productprice
      return {
        ok: true,
        message: "ProductPrices creados con éxito.",
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
      .registerClient(ProductPriceCommandService.name)
      .get(ProductPriceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductPriceDto>("updateProductPrice", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductPriceDto
  ): Promise<ProductPriceResponse<ProductPrice>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductPrice(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productprice no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductPrices no encontradas.");
      // Devolver productprice
      return {
        ok: true,
        message: "ProductPrice actualizada con éxito.",
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
      .registerClient(ProductPriceCommandService.name)
      .get(ProductPriceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductPriceDto>("updateProductPrices", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductPriceDto[]
  ): Promise<ProductPricesResponse<ProductPrice>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductPrice.fromDto(entity))
      );
      // Respuesta si el productprice no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductPrices no encontradas.");
      // Devolver productprice
      return {
        ok: true,
        message: "ProductPrices actualizadas con éxito.",
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
      .registerClient(ProductPriceCommandService.name)
      .get(ProductPriceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductPriceDto>("deleteProductPrice", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductPriceResponse<ProductPrice>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productprice no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductPrice no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productprice
      return {
        ok: true,
        message: "Instancia de ProductPrice eliminada con éxito.",
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
      .registerClient(ProductPriceCommandService.name)
      .get(ProductPriceCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductPrices", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

