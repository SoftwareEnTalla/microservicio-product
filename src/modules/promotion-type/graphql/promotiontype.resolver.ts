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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { PromotionType } from "../entities/promotion-type.entity";

//Definición de comandos
import {
  CreatePromotionTypeCommand,
  UpdatePromotionTypeCommand,
  DeletePromotionTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PromotionTypeQueryService } from "../services/promotiontypequery.service";


import { PromotionTypeResponse, PromotionTypesResponse } from "../types/promotiontype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePromotionTypeDto, 
CreateOrUpdatePromotionTypeDto, 
PromotionTypeValueInput, 
PromotionTypeDto, 
CreatePromotionTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PromotionType)
export class PromotionTypeResolver {

   //Constructor del resolver de PromotionType
  constructor(
    private readonly service: PromotionTypeQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => PromotionTypeResponse<PromotionType>)
  async createPromotionType(
    @Args("input", { type: () => CreatePromotionTypeDto }) input: CreatePromotionTypeDto
  ): Promise<PromotionTypeResponse<PromotionType>> {
    return this.commandBus.execute(new CreatePromotionTypeCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Mutation(() => PromotionTypeResponse<PromotionType>)
  async updatePromotionType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePromotionTypeDto
  ): Promise<PromotionTypeResponse<PromotionType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePromotionTypeCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Mutation(() => PromotionTypeResponse<PromotionType>)
  async createOrUpdatePromotionType(
    @Args("data", { type: () => CreateOrUpdatePromotionTypeDto })
    data: CreateOrUpdatePromotionTypeDto
  ): Promise<PromotionTypeResponse<PromotionType>> {
    if (data.id) {
      const existingPromotionType = await this.service.findById(data.id);
      if (existingPromotionType) {
        return this.commandBus.execute(
          new UpdatePromotionTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePromotionTypeDto | UpdatePromotionTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePromotionTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePromotionTypeDto | UpdatePromotionTypeDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePromotionType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePromotionTypeCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  // Queries
  @Query(() => PromotionTypesResponse<PromotionType>)
  async promotiontypes(
    options?: FindManyOptions<PromotionType>,
    paginationArgs?: PaginationArgs
  ): Promise<PromotionTypesResponse<PromotionType>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Query(() => PromotionTypesResponse<PromotionType>)
  async promotiontype(
    @Args("id", { type: () => String }) id: string
  ): Promise<PromotionTypeResponse<PromotionType>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Query(() => PromotionTypesResponse<PromotionType>)
  async promotiontypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PromotionTypeValueInput }) value: PromotionTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PromotionTypesResponse<PromotionType>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Query(() => PromotionTypesResponse<PromotionType>)
  async promotiontypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PromotionTypesResponse<PromotionType>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Query(() => Number)
  async totalPromotionTypes(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Query(() => PromotionTypesResponse<PromotionType>)
  async searchPromotionTypes(
    @Args("where", { type: () => PromotionTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PromotionTypesResponse<PromotionType>> {
    const promotiontypes = await this.service.findAndCount(where);
    return promotiontypes;
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Query(() => PromotionTypeResponse<PromotionType>, { nullable: true })
  async findOnePromotionType(
    @Args("where", { type: () => PromotionTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PromotionTypeResponse<PromotionType>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PromotionTypeResolver.name)

      .get(PromotionTypeResolver.name),
    })
  @Query(() => PromotionTypeResponse<PromotionType>)
  async findOnePromotionTypeOrFail(
    @Args("where", { type: () => PromotionTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PromotionTypeResponse<PromotionType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

