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
import { ProductRelationship } from "../entities/product-relationship.entity";

//Definición de comandos
import {
  CreateProductRelationshipCommand,
  UpdateProductRelationshipCommand,
  DeleteProductRelationshipCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductRelationshipQueryService } from "../services/productrelationshipquery.service";


import { ProductRelationshipResponse, ProductRelationshipsResponse } from "../types/productrelationship.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductRelationshipDto, 
CreateOrUpdateProductRelationshipDto, 
ProductRelationshipValueInput, 
ProductRelationshipDto, 
CreateProductRelationshipDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductRelationship)
export class ProductRelationshipResolver {

   //Constructor del resolver de ProductRelationship
  constructor(
    private readonly service: ProductRelationshipQueryService,
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductRelationshipResponse<ProductRelationship>)
  async createProductRelationship(
    @Args("input", { type: () => CreateProductRelationshipDto }) input: CreateProductRelationshipDto
  ): Promise<ProductRelationshipResponse<ProductRelationship>> {
    return this.commandBus.execute(new CreateProductRelationshipCommand(input));
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Mutation(() => ProductRelationshipResponse<ProductRelationship>)
  async updateProductRelationship(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductRelationshipDto
  ): Promise<ProductRelationshipResponse<ProductRelationship>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductRelationshipCommand(payLoad, {
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Mutation(() => ProductRelationshipResponse<ProductRelationship>)
  async createOrUpdateProductRelationship(
    @Args("data", { type: () => CreateOrUpdateProductRelationshipDto })
    data: CreateOrUpdateProductRelationshipDto
  ): Promise<ProductRelationshipResponse<ProductRelationship>> {
    if (data.id) {
      const existingProductRelationship = await this.service.findById(data.id);
      if (existingProductRelationship) {
        return this.commandBus.execute(
          new UpdateProductRelationshipCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductRelationshipDto | UpdateProductRelationshipDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductRelationshipCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductRelationshipDto | UpdateProductRelationshipDto).createdBy ||
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductRelationship(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductRelationshipCommand(id));
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  // Queries
  @Query(() => ProductRelationshipsResponse<ProductRelationship>)
  async productrelationships(
    options?: FindManyOptions<ProductRelationship>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductRelationshipsResponse<ProductRelationship>> {
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Query(() => ProductRelationshipsResponse<ProductRelationship>)
  async productrelationship(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductRelationshipResponse<ProductRelationship>> {
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Query(() => ProductRelationshipsResponse<ProductRelationship>)
  async productrelationshipsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductRelationshipValueInput }) value: ProductRelationshipValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductRelationshipsResponse<ProductRelationship>> {
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Query(() => ProductRelationshipsResponse<ProductRelationship>)
  async productrelationshipsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductRelationshipsResponse<ProductRelationship>> {
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Query(() => Number)
  async totalProductRelationships(): Promise<number> {
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Query(() => ProductRelationshipsResponse<ProductRelationship>)
  async searchProductRelationships(
    @Args("where", { type: () => ProductRelationshipDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductRelationshipsResponse<ProductRelationship>> {
    const productrelationships = await this.service.findAndCount(where);
    return productrelationships;
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Query(() => ProductRelationshipResponse<ProductRelationship>, { nullable: true })
  async findOneProductRelationship(
    @Args("where", { type: () => ProductRelationshipDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductRelationshipResponse<ProductRelationship>> {
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
      .registerClient(ProductRelationshipResolver.name)

      .get(ProductRelationshipResolver.name),
    })
  @Query(() => ProductRelationshipResponse<ProductRelationship>)
  async findOneProductRelationshipOrFail(
    @Args("where", { type: () => ProductRelationshipDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductRelationshipResponse<ProductRelationship> | Error> {
    return this.service.findOneOrFail(where);
  }
}

