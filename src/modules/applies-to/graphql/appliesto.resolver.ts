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
import { AppliesTo } from "../entities/applies-to.entity";

//Definición de comandos
import {
  CreateAppliesToCommand,
  UpdateAppliesToCommand,
  DeleteAppliesToCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { AppliesToQueryService } from "../services/appliestoquery.service";


import { AppliesToResponse, AppliesTosResponse } from "../types/appliesto.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateAppliesToDto, 
CreateOrUpdateAppliesToDto, 
AppliesToValueInput, 
AppliesToDto, 
CreateAppliesToDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => AppliesTo)
export class AppliesToResolver {

   //Constructor del resolver de AppliesTo
  constructor(
    private readonly service: AppliesToQueryService,
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  // Mutaciones
  @Mutation(() => AppliesToResponse<AppliesTo>)
  async createAppliesTo(
    @Args("input", { type: () => CreateAppliesToDto }) input: CreateAppliesToDto
  ): Promise<AppliesToResponse<AppliesTo>> {
    return this.commandBus.execute(new CreateAppliesToCommand(input));
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Mutation(() => AppliesToResponse<AppliesTo>)
  async updateAppliesTo(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateAppliesToDto
  ): Promise<AppliesToResponse<AppliesTo>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateAppliesToCommand(payLoad, {
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Mutation(() => AppliesToResponse<AppliesTo>)
  async createOrUpdateAppliesTo(
    @Args("data", { type: () => CreateOrUpdateAppliesToDto })
    data: CreateOrUpdateAppliesToDto
  ): Promise<AppliesToResponse<AppliesTo>> {
    if (data.id) {
      const existingAppliesTo = await this.service.findById(data.id);
      if (existingAppliesTo) {
        return this.commandBus.execute(
          new UpdateAppliesToCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateAppliesToDto | UpdateAppliesToDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateAppliesToCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateAppliesToDto | UpdateAppliesToDto).createdBy ||
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteAppliesTo(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteAppliesToCommand(id));
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  // Queries
  @Query(() => AppliesTosResponse<AppliesTo>)
  async appliestos(
    options?: FindManyOptions<AppliesTo>,
    paginationArgs?: PaginationArgs
  ): Promise<AppliesTosResponse<AppliesTo>> {
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Query(() => AppliesTosResponse<AppliesTo>)
  async appliesto(
    @Args("id", { type: () => String }) id: string
  ): Promise<AppliesToResponse<AppliesTo>> {
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Query(() => AppliesTosResponse<AppliesTo>)
  async appliestosByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => AppliesToValueInput }) value: AppliesToValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AppliesTosResponse<AppliesTo>> {
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Query(() => AppliesTosResponse<AppliesTo>)
  async appliestosWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AppliesTosResponse<AppliesTo>> {
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Query(() => Number)
  async totalAppliesTos(): Promise<number> {
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Query(() => AppliesTosResponse<AppliesTo>)
  async searchAppliesTos(
    @Args("where", { type: () => AppliesToDto, nullable: false })
    where: Record<string, any>
  ): Promise<AppliesTosResponse<AppliesTo>> {
    const appliestos = await this.service.findAndCount(where);
    return appliestos;
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Query(() => AppliesToResponse<AppliesTo>, { nullable: true })
  async findOneAppliesTo(
    @Args("where", { type: () => AppliesToDto, nullable: false })
    where: Record<string, any>
  ): Promise<AppliesToResponse<AppliesTo>> {
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
      .registerClient(AppliesToResolver.name)

      .get(AppliesToResolver.name),
    })
  @Query(() => AppliesToResponse<AppliesTo>)
  async findOneAppliesToOrFail(
    @Args("where", { type: () => AppliesToDto, nullable: false })
    where: Record<string, any>
  ): Promise<AppliesToResponse<AppliesTo> | Error> {
    return this.service.findOneOrFail(where);
  }
}

