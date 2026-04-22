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
import { ProductInventory } from "../entities/product-inventory.entity";
import { CreateProductInventoryDto, UpdateProductInventoryDto, DeleteProductInventoryDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ProductInventoryCommandRepository } from "../repositories/productinventorycommand.repository";
import { ProductInventoryQueryRepository } from "../repositories/productinventoryquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ProductInventoryResponse, ProductInventorysResponse } from "../types/productinventory.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ProductInventoryQueryService } from "./productinventoryquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ProductInventoryCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ProductInventoryCommandService.name);
  //Constructo del servicio ProductInventoryCommandService
  constructor(
    private readonly repository: ProductInventoryCommandRepository,
    private readonly queryRepository: ProductInventoryQueryRepository,
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
      .registerClient(ProductInventoryQueryService.name)
      .get(ProductInventoryQueryService.name),
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
        await this.eventStore.appendEvent('product-inventory-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: ProductInventory | null,
    current?: ProductInventory | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: reserved-stock-cannot-exceed-total-visible-stock
      // El stock reservado no debe superar el stock disponible más entrante sin política explícita.
      if ((this.dslValue(entityData, currentData, inputData, 'reservedStock') === undefined || this.dslValue(entityData, currentData, inputData, 'reservedStock') === null || this.dslValue(entityData, currentData, inputData, 'reservedStock') >= 0)) {
        logger.warn('PRODUCT_INVENTORY_001: Verificar consistencia entre stock reservado y stock visible');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: reserved-stock-cannot-exceed-total-visible-stock
      // El stock reservado no debe superar el stock disponible más entrante sin política explícita.
      if ((this.dslValue(entityData, currentData, inputData, 'reservedStock') === undefined || this.dslValue(entityData, currentData, inputData, 'reservedStock') === null || this.dslValue(entityData, currentData, inputData, 'reservedStock') >= 0)) {
        logger.warn('PRODUCT_INVENTORY_001: Verificar consistencia entre stock reservado y stock visible');
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
      .registerClient(ProductInventoryCommandService.name)
      .get(ProductInventoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateProductInventoryDto>("createProductInventory", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createProductInventoryDtoInput: CreateProductInventoryDto
  ): Promise<ProductInventoryResponse<ProductInventory>> {
    try {
      logger.info("Receiving in service:", createProductInventoryDtoInput);
      const candidate = ProductInventory.fromDto(createProductInventoryDtoInput);
      await this.applyDslServiceRules("create", createProductInventoryDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createProductInventoryDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el productinventory no existe
      if (!entity)
        throw new NotFoundException("Entidad ProductInventory no encontrada.");
      // Devolver productinventory
      return {
        ok: true,
        message: "ProductInventory obtenido con éxito.",
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
      .registerClient(ProductInventoryCommandService.name)
      .get(ProductInventoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<ProductInventory>("createProductInventorys", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createProductInventoryDtosInput: CreateProductInventoryDto[]
  ): Promise<ProductInventorysResponse<ProductInventory>> {
    try {
      const entities = await this.repository.bulkCreate(
        createProductInventoryDtosInput.map((entity) => ProductInventory.fromDto(entity))
      );

      // Respuesta si el productinventory no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductInventorys no encontradas.");
      // Devolver productinventory
      return {
        ok: true,
        message: "ProductInventorys creados con éxito.",
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
      .registerClient(ProductInventoryCommandService.name)
      .get(ProductInventoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductInventoryDto>("updateProductInventory", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateProductInventoryDto
  ): Promise<ProductInventoryResponse<ProductInventory>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new ProductInventory(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el productinventory no existe
      if (!entity)
        throw new NotFoundException("Entidades ProductInventorys no encontradas.");
      // Devolver productinventory
      return {
        ok: true,
        message: "ProductInventory actualizada con éxito.",
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
      .registerClient(ProductInventoryCommandService.name)
      .get(ProductInventoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateProductInventoryDto>("updateProductInventorys", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateProductInventoryDto[]
  ): Promise<ProductInventorysResponse<ProductInventory>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => ProductInventory.fromDto(entity))
      );
      // Respuesta si el productinventory no existe
      if (!entities)
        throw new NotFoundException("Entidades ProductInventorys no encontradas.");
      // Devolver productinventory
      return {
        ok: true,
        message: "ProductInventorys actualizadas con éxito.",
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
      .registerClient(ProductInventoryCommandService.name)
      .get(ProductInventoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteProductInventoryDto>("deleteProductInventory", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ProductInventoryResponse<ProductInventory>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el productinventory no existe
      if (!entity)
        throw new NotFoundException("Instancias de ProductInventory no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver productinventory
      return {
        ok: true,
        message: "Instancia de ProductInventory eliminada con éxito.",
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
      .registerClient(ProductInventoryCommandService.name)
      .get(ProductInventoryCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteProductInventorys", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

