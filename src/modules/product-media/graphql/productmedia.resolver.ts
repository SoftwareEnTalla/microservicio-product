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
import { ProductMedia } from "../entities/product-media.entity";

//Definición de comandos
import {
  CreateProductMediaCommand,
  UpdateProductMediaCommand,
  DeleteProductMediaCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductMediaQueryService } from "../services/productmediaquery.service";


import { ProductMediaResponse, ProductMediasResponse } from "../types/productmedia.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductMediaDto, 
CreateOrUpdateProductMediaDto, 
ProductMediaValueInput, 
ProductMediaDto, 
CreateProductMediaDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductMedia)
export class ProductMediaResolver {

   //Constructor del resolver de ProductMedia
  constructor(
    private readonly service: ProductMediaQueryService,
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductMediaResponse<ProductMedia>)
  async createProductMedia(
    @Args("input", { type: () => CreateProductMediaDto }) input: CreateProductMediaDto
  ): Promise<ProductMediaResponse<ProductMedia>> {
    return this.commandBus.execute(new CreateProductMediaCommand(input));
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Mutation(() => ProductMediaResponse<ProductMedia>)
  async updateProductMedia(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductMediaDto
  ): Promise<ProductMediaResponse<ProductMedia>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductMediaCommand(payLoad, {
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Mutation(() => ProductMediaResponse<ProductMedia>)
  async createOrUpdateProductMedia(
    @Args("data", { type: () => CreateOrUpdateProductMediaDto })
    data: CreateOrUpdateProductMediaDto
  ): Promise<ProductMediaResponse<ProductMedia>> {
    if (data.id) {
      const existingProductMedia = await this.service.findById(data.id);
      if (existingProductMedia) {
        return this.commandBus.execute(
          new UpdateProductMediaCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductMediaDto | UpdateProductMediaDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductMediaCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductMediaDto | UpdateProductMediaDto).createdBy ||
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductMedia(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductMediaCommand(id));
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  // Queries
  @Query(() => ProductMediasResponse<ProductMedia>)
  async productmedias(
    options?: FindManyOptions<ProductMedia>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductMediasResponse<ProductMedia>> {
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Query(() => ProductMediasResponse<ProductMedia>)
  async productmedia(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductMediaResponse<ProductMedia>> {
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Query(() => ProductMediasResponse<ProductMedia>)
  async productmediasByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductMediaValueInput }) value: ProductMediaValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductMediasResponse<ProductMedia>> {
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Query(() => ProductMediasResponse<ProductMedia>)
  async productmediasWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductMediasResponse<ProductMedia>> {
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Query(() => Number)
  async totalProductMedias(): Promise<number> {
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Query(() => ProductMediasResponse<ProductMedia>)
  async searchProductMedias(
    @Args("where", { type: () => ProductMediaDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductMediasResponse<ProductMedia>> {
    const productmedias = await this.service.findAndCount(where);
    return productmedias;
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Query(() => ProductMediaResponse<ProductMedia>, { nullable: true })
  async findOneProductMedia(
    @Args("where", { type: () => ProductMediaDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductMediaResponse<ProductMedia>> {
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
      .registerClient(ProductMediaResolver.name)

      .get(ProductMediaResolver.name),
    })
  @Query(() => ProductMediaResponse<ProductMedia>)
  async findOneProductMediaOrFail(
    @Args("where", { type: () => ProductMediaDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductMediaResponse<ProductMedia> | Error> {
    return this.service.findOneOrFail(where);
  }
}

