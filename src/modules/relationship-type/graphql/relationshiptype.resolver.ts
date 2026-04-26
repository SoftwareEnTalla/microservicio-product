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
import { RelationshipType } from "../entities/relationship-type.entity";

//Definición de comandos
import {
  CreateRelationshipTypeCommand,
  UpdateRelationshipTypeCommand,
  DeleteRelationshipTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { RelationshipTypeQueryService } from "../services/relationshiptypequery.service";


import { RelationshipTypeResponse, RelationshipTypesResponse } from "../types/relationshiptype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateRelationshipTypeDto, 
CreateOrUpdateRelationshipTypeDto, 
RelationshipTypeValueInput, 
RelationshipTypeDto, 
CreateRelationshipTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => RelationshipType)
export class RelationshipTypeResolver {

   //Constructor del resolver de RelationshipType
  constructor(
    private readonly service: RelationshipTypeQueryService,
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => RelationshipTypeResponse<RelationshipType>)
  async createRelationshipType(
    @Args("input", { type: () => CreateRelationshipTypeDto }) input: CreateRelationshipTypeDto
  ): Promise<RelationshipTypeResponse<RelationshipType>> {
    return this.commandBus.execute(new CreateRelationshipTypeCommand(input));
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Mutation(() => RelationshipTypeResponse<RelationshipType>)
  async updateRelationshipType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateRelationshipTypeDto
  ): Promise<RelationshipTypeResponse<RelationshipType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateRelationshipTypeCommand(payLoad, {
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Mutation(() => RelationshipTypeResponse<RelationshipType>)
  async createOrUpdateRelationshipType(
    @Args("data", { type: () => CreateOrUpdateRelationshipTypeDto })
    data: CreateOrUpdateRelationshipTypeDto
  ): Promise<RelationshipTypeResponse<RelationshipType>> {
    if (data.id) {
      const existingRelationshipType = await this.service.findById(data.id);
      if (existingRelationshipType) {
        return this.commandBus.execute(
          new UpdateRelationshipTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateRelationshipTypeDto | UpdateRelationshipTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateRelationshipTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateRelationshipTypeDto | UpdateRelationshipTypeDto).createdBy ||
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteRelationshipType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteRelationshipTypeCommand(id));
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  // Queries
  @Query(() => RelationshipTypesResponse<RelationshipType>)
  async relationshiptypes(
    options?: FindManyOptions<RelationshipType>,
    paginationArgs?: PaginationArgs
  ): Promise<RelationshipTypesResponse<RelationshipType>> {
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Query(() => RelationshipTypesResponse<RelationshipType>)
  async relationshiptype(
    @Args("id", { type: () => String }) id: string
  ): Promise<RelationshipTypeResponse<RelationshipType>> {
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Query(() => RelationshipTypesResponse<RelationshipType>)
  async relationshiptypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => RelationshipTypeValueInput }) value: RelationshipTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<RelationshipTypesResponse<RelationshipType>> {
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Query(() => RelationshipTypesResponse<RelationshipType>)
  async relationshiptypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<RelationshipTypesResponse<RelationshipType>> {
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Query(() => Number)
  async totalRelationshipTypes(): Promise<number> {
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Query(() => RelationshipTypesResponse<RelationshipType>)
  async searchRelationshipTypes(
    @Args("where", { type: () => RelationshipTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<RelationshipTypesResponse<RelationshipType>> {
    const relationshiptypes = await this.service.findAndCount(where);
    return relationshiptypes;
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Query(() => RelationshipTypeResponse<RelationshipType>, { nullable: true })
  async findOneRelationshipType(
    @Args("where", { type: () => RelationshipTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<RelationshipTypeResponse<RelationshipType>> {
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
      .registerClient(RelationshipTypeResolver.name)

      .get(RelationshipTypeResolver.name),
    })
  @Query(() => RelationshipTypeResponse<RelationshipType>)
  async findOneRelationshipTypeOrFail(
    @Args("where", { type: () => RelationshipTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<RelationshipTypeResponse<RelationshipType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

