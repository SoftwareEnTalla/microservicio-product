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
import { StockStatus } from "../entities/stock-status.entity";

//Definición de comandos
import {
  CreateStockStatusCommand,
  UpdateStockStatusCommand,
  DeleteStockStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { StockStatusQueryService } from "../services/stockstatusquery.service";


import { StockStatusResponse, StockStatussResponse } from "../types/stockstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateStockStatusDto, 
CreateOrUpdateStockStatusDto, 
StockStatusValueInput, 
StockStatusDto, 
CreateStockStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => StockStatus)
export class StockStatusResolver {

   //Constructor del resolver de StockStatus
  constructor(
    private readonly service: StockStatusQueryService,
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => StockStatusResponse<StockStatus>)
  async createStockStatus(
    @Args("input", { type: () => CreateStockStatusDto }) input: CreateStockStatusDto
  ): Promise<StockStatusResponse<StockStatus>> {
    return this.commandBus.execute(new CreateStockStatusCommand(input));
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Mutation(() => StockStatusResponse<StockStatus>)
  async updateStockStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateStockStatusDto
  ): Promise<StockStatusResponse<StockStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateStockStatusCommand(payLoad, {
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Mutation(() => StockStatusResponse<StockStatus>)
  async createOrUpdateStockStatus(
    @Args("data", { type: () => CreateOrUpdateStockStatusDto })
    data: CreateOrUpdateStockStatusDto
  ): Promise<StockStatusResponse<StockStatus>> {
    if (data.id) {
      const existingStockStatus = await this.service.findById(data.id);
      if (existingStockStatus) {
        return this.commandBus.execute(
          new UpdateStockStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateStockStatusDto | UpdateStockStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateStockStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateStockStatusDto | UpdateStockStatusDto).createdBy ||
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteStockStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteStockStatusCommand(id));
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  // Queries
  @Query(() => StockStatussResponse<StockStatus>)
  async stockstatuss(
    options?: FindManyOptions<StockStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<StockStatussResponse<StockStatus>> {
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Query(() => StockStatussResponse<StockStatus>)
  async stockstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<StockStatusResponse<StockStatus>> {
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Query(() => StockStatussResponse<StockStatus>)
  async stockstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => StockStatusValueInput }) value: StockStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<StockStatussResponse<StockStatus>> {
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Query(() => StockStatussResponse<StockStatus>)
  async stockstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<StockStatussResponse<StockStatus>> {
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Query(() => Number)
  async totalStockStatuss(): Promise<number> {
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Query(() => StockStatussResponse<StockStatus>)
  async searchStockStatuss(
    @Args("where", { type: () => StockStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<StockStatussResponse<StockStatus>> {
    const stockstatuss = await this.service.findAndCount(where);
    return stockstatuss;
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Query(() => StockStatusResponse<StockStatus>, { nullable: true })
  async findOneStockStatus(
    @Args("where", { type: () => StockStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<StockStatusResponse<StockStatus>> {
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
      .registerClient(StockStatusResolver.name)

      .get(StockStatusResolver.name),
    })
  @Query(() => StockStatusResponse<StockStatus>)
  async findOneStockStatusOrFail(
    @Args("where", { type: () => StockStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<StockStatusResponse<StockStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

