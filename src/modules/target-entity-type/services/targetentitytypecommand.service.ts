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
import { TargetEntityType } from "../entities/target-entity-type.entity";
import { CreateTargetEntityTypeDto, UpdateTargetEntityTypeDto, DeleteTargetEntityTypeDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { TargetEntityTypeCommandRepository } from "../repositories/targetentitytypecommand.repository";
import { TargetEntityTypeQueryRepository } from "../repositories/targetentitytypequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { TargetEntityTypeResponse, TargetEntityTypesResponse } from "../types/targetentitytype.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { TargetEntityTypeQueryService } from "./targetentitytypequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class TargetEntityTypeCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(TargetEntityTypeCommandService.name);
  //Constructo del servicio TargetEntityTypeCommandService
  constructor(
    private readonly repository: TargetEntityTypeCommandRepository,
    private readonly queryRepository: TargetEntityTypeQueryRepository,
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
      .registerClient(TargetEntityTypeQueryService.name)
      .get(TargetEntityTypeQueryService.name),
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
        await this.eventStore.appendEvent('target-entity-type-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: TargetEntityType | null,
    current?: TargetEntityType | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
// No se definieron business-rules target=service.
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
      .registerClient(TargetEntityTypeCommandService.name)
      .get(TargetEntityTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateTargetEntityTypeDto>("createTargetEntityType", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createTargetEntityTypeDtoInput: CreateTargetEntityTypeDto
  ): Promise<TargetEntityTypeResponse<TargetEntityType>> {
    try {
      logger.info("Receiving in service:", createTargetEntityTypeDtoInput);
      const candidate = TargetEntityType.fromDto(createTargetEntityTypeDtoInput);
      await this.applyDslServiceRules("create", createTargetEntityTypeDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createTargetEntityTypeDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el targetentitytype no existe
      if (!entity)
        throw new NotFoundException("Entidad TargetEntityType no encontrada.");
      // Devolver targetentitytype
      return {
        ok: true,
        message: "TargetEntityType obtenido con éxito.",
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
      .registerClient(TargetEntityTypeCommandService.name)
      .get(TargetEntityTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<TargetEntityType>("createTargetEntityTypes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createTargetEntityTypeDtosInput: CreateTargetEntityTypeDto[]
  ): Promise<TargetEntityTypesResponse<TargetEntityType>> {
    try {
      const entities = await this.repository.bulkCreate(
        createTargetEntityTypeDtosInput.map((entity) => TargetEntityType.fromDto(entity))
      );

      // Respuesta si el targetentitytype no existe
      if (!entities)
        throw new NotFoundException("Entidades TargetEntityTypes no encontradas.");
      // Devolver targetentitytype
      return {
        ok: true,
        message: "TargetEntityTypes creados con éxito.",
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
      .registerClient(TargetEntityTypeCommandService.name)
      .get(TargetEntityTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTargetEntityTypeDto>("updateTargetEntityType", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateTargetEntityTypeDto
  ): Promise<TargetEntityTypeResponse<TargetEntityType>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new TargetEntityType(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el targetentitytype no existe
      if (!entity)
        throw new NotFoundException("Entidades TargetEntityTypes no encontradas.");
      // Devolver targetentitytype
      return {
        ok: true,
        message: "TargetEntityType actualizada con éxito.",
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
      .registerClient(TargetEntityTypeCommandService.name)
      .get(TargetEntityTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTargetEntityTypeDto>("updateTargetEntityTypes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateTargetEntityTypeDto[]
  ): Promise<TargetEntityTypesResponse<TargetEntityType>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => TargetEntityType.fromDto(entity))
      );
      // Respuesta si el targetentitytype no existe
      if (!entities)
        throw new NotFoundException("Entidades TargetEntityTypes no encontradas.");
      // Devolver targetentitytype
      return {
        ok: true,
        message: "TargetEntityTypes actualizadas con éxito.",
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
      .registerClient(TargetEntityTypeCommandService.name)
      .get(TargetEntityTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteTargetEntityTypeDto>("deleteTargetEntityType", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<TargetEntityTypeResponse<TargetEntityType>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el targetentitytype no existe
      if (!entity)
        throw new NotFoundException("Instancias de TargetEntityType no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver targetentitytype
      return {
        ok: true,
        message: "Instancia de TargetEntityType eliminada con éxito.",
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
      .registerClient(TargetEntityTypeCommandService.name)
      .get(TargetEntityTypeCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteTargetEntityTypes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

