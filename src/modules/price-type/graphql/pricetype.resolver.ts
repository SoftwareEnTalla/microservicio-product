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
import { PriceType } from "../entities/price-type.entity";

//Definición de comandos
import {
  CreatePriceTypeCommand,
  UpdatePriceTypeCommand,
  DeletePriceTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PriceTypeQueryService } from "../services/pricetypequery.service";


import { PriceTypeResponse, PriceTypesResponse } from "../types/pricetype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePriceTypeDto, 
CreateOrUpdatePriceTypeDto, 
PriceTypeValueInput, 
PriceTypeDto, 
CreatePriceTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PriceType)
export class PriceTypeResolver {

   //Constructor del resolver de PriceType
  constructor(
    private readonly service: PriceTypeQueryService,
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => PriceTypeResponse<PriceType>)
  async createPriceType(
    @Args("input", { type: () => CreatePriceTypeDto }) input: CreatePriceTypeDto
  ): Promise<PriceTypeResponse<PriceType>> {
    return this.commandBus.execute(new CreatePriceTypeCommand(input));
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Mutation(() => PriceTypeResponse<PriceType>)
  async updatePriceType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePriceTypeDto
  ): Promise<PriceTypeResponse<PriceType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePriceTypeCommand(payLoad, {
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Mutation(() => PriceTypeResponse<PriceType>)
  async createOrUpdatePriceType(
    @Args("data", { type: () => CreateOrUpdatePriceTypeDto })
    data: CreateOrUpdatePriceTypeDto
  ): Promise<PriceTypeResponse<PriceType>> {
    if (data.id) {
      const existingPriceType = await this.service.findById(data.id);
      if (existingPriceType) {
        return this.commandBus.execute(
          new UpdatePriceTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePriceTypeDto | UpdatePriceTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePriceTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePriceTypeDto | UpdatePriceTypeDto).createdBy ||
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePriceType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePriceTypeCommand(id));
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  // Queries
  @Query(() => PriceTypesResponse<PriceType>)
  async pricetypes(
    options?: FindManyOptions<PriceType>,
    paginationArgs?: PaginationArgs
  ): Promise<PriceTypesResponse<PriceType>> {
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Query(() => PriceTypesResponse<PriceType>)
  async pricetype(
    @Args("id", { type: () => String }) id: string
  ): Promise<PriceTypeResponse<PriceType>> {
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Query(() => PriceTypesResponse<PriceType>)
  async pricetypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PriceTypeValueInput }) value: PriceTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PriceTypesResponse<PriceType>> {
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Query(() => PriceTypesResponse<PriceType>)
  async pricetypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PriceTypesResponse<PriceType>> {
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Query(() => Number)
  async totalPriceTypes(): Promise<number> {
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Query(() => PriceTypesResponse<PriceType>)
  async searchPriceTypes(
    @Args("where", { type: () => PriceTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PriceTypesResponse<PriceType>> {
    const pricetypes = await this.service.findAndCount(where);
    return pricetypes;
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Query(() => PriceTypeResponse<PriceType>, { nullable: true })
  async findOnePriceType(
    @Args("where", { type: () => PriceTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PriceTypeResponse<PriceType>> {
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
      .registerClient(PriceTypeResolver.name)

      .get(PriceTypeResolver.name),
    })
  @Query(() => PriceTypeResponse<PriceType>)
  async findOnePriceTypeOrFail(
    @Args("where", { type: () => PriceTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PriceTypeResponse<PriceType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

