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
import { MediaType } from "../entities/media-type.entity";

//Definición de comandos
import {
  CreateMediaTypeCommand,
  UpdateMediaTypeCommand,
  DeleteMediaTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { MediaTypeQueryService } from "../services/mediatypequery.service";


import { MediaTypeResponse, MediaTypesResponse } from "../types/mediatype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateMediaTypeDto, 
CreateOrUpdateMediaTypeDto, 
MediaTypeValueInput, 
MediaTypeDto, 
CreateMediaTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => MediaType)
export class MediaTypeResolver {

   //Constructor del resolver de MediaType
  constructor(
    private readonly service: MediaTypeQueryService,
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => MediaTypeResponse<MediaType>)
  async createMediaType(
    @Args("input", { type: () => CreateMediaTypeDto }) input: CreateMediaTypeDto
  ): Promise<MediaTypeResponse<MediaType>> {
    return this.commandBus.execute(new CreateMediaTypeCommand(input));
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Mutation(() => MediaTypeResponse<MediaType>)
  async updateMediaType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateMediaTypeDto
  ): Promise<MediaTypeResponse<MediaType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateMediaTypeCommand(payLoad, {
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Mutation(() => MediaTypeResponse<MediaType>)
  async createOrUpdateMediaType(
    @Args("data", { type: () => CreateOrUpdateMediaTypeDto })
    data: CreateOrUpdateMediaTypeDto
  ): Promise<MediaTypeResponse<MediaType>> {
    if (data.id) {
      const existingMediaType = await this.service.findById(data.id);
      if (existingMediaType) {
        return this.commandBus.execute(
          new UpdateMediaTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateMediaTypeDto | UpdateMediaTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateMediaTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateMediaTypeDto | UpdateMediaTypeDto).createdBy ||
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteMediaType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteMediaTypeCommand(id));
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  // Queries
  @Query(() => MediaTypesResponse<MediaType>)
  async mediatypes(
    options?: FindManyOptions<MediaType>,
    paginationArgs?: PaginationArgs
  ): Promise<MediaTypesResponse<MediaType>> {
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Query(() => MediaTypesResponse<MediaType>)
  async mediatype(
    @Args("id", { type: () => String }) id: string
  ): Promise<MediaTypeResponse<MediaType>> {
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Query(() => MediaTypesResponse<MediaType>)
  async mediatypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => MediaTypeValueInput }) value: MediaTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MediaTypesResponse<MediaType>> {
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Query(() => MediaTypesResponse<MediaType>)
  async mediatypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MediaTypesResponse<MediaType>> {
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Query(() => Number)
  async totalMediaTypes(): Promise<number> {
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Query(() => MediaTypesResponse<MediaType>)
  async searchMediaTypes(
    @Args("where", { type: () => MediaTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<MediaTypesResponse<MediaType>> {
    const mediatypes = await this.service.findAndCount(where);
    return mediatypes;
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Query(() => MediaTypeResponse<MediaType>, { nullable: true })
  async findOneMediaType(
    @Args("where", { type: () => MediaTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<MediaTypeResponse<MediaType>> {
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
      .registerClient(MediaTypeResolver.name)

      .get(MediaTypeResolver.name),
    })
  @Query(() => MediaTypeResponse<MediaType>)
  async findOneMediaTypeOrFail(
    @Args("where", { type: () => MediaTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<MediaTypeResponse<MediaType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

