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
import { ProductPromotion } from "../entities/product-promotion.entity";

//Definición de comandos
import {
  CreateProductPromotionCommand,
  UpdateProductPromotionCommand,
  DeleteProductPromotionCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductPromotionQueryService } from "../services/productpromotionquery.service";


import { ProductPromotionResponse, ProductPromotionsResponse } from "../types/productpromotion.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductPromotionDto, 
CreateOrUpdateProductPromotionDto, 
ProductPromotionValueInput, 
ProductPromotionDto, 
CreateProductPromotionDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductPromotion)
export class ProductPromotionResolver {

   //Constructor del resolver de ProductPromotion
  constructor(
    private readonly service: ProductPromotionQueryService,
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductPromotionResponse<ProductPromotion>)
  async createProductPromotion(
    @Args("input", { type: () => CreateProductPromotionDto }) input: CreateProductPromotionDto
  ): Promise<ProductPromotionResponse<ProductPromotion>> {
    return this.commandBus.execute(new CreateProductPromotionCommand(input));
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Mutation(() => ProductPromotionResponse<ProductPromotion>)
  async updateProductPromotion(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductPromotionDto
  ): Promise<ProductPromotionResponse<ProductPromotion>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductPromotionCommand(payLoad, {
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Mutation(() => ProductPromotionResponse<ProductPromotion>)
  async createOrUpdateProductPromotion(
    @Args("data", { type: () => CreateOrUpdateProductPromotionDto })
    data: CreateOrUpdateProductPromotionDto
  ): Promise<ProductPromotionResponse<ProductPromotion>> {
    if (data.id) {
      const existingProductPromotion = await this.service.findById(data.id);
      if (existingProductPromotion) {
        return this.commandBus.execute(
          new UpdateProductPromotionCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductPromotionDto | UpdateProductPromotionDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductPromotionCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductPromotionDto | UpdateProductPromotionDto).createdBy ||
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductPromotion(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductPromotionCommand(id));
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  // Queries
  @Query(() => ProductPromotionsResponse<ProductPromotion>)
  async productpromotions(
    options?: FindManyOptions<ProductPromotion>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductPromotionsResponse<ProductPromotion>> {
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Query(() => ProductPromotionsResponse<ProductPromotion>)
  async productpromotion(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductPromotionResponse<ProductPromotion>> {
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Query(() => ProductPromotionsResponse<ProductPromotion>)
  async productpromotionsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductPromotionValueInput }) value: ProductPromotionValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductPromotionsResponse<ProductPromotion>> {
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Query(() => ProductPromotionsResponse<ProductPromotion>)
  async productpromotionsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductPromotionsResponse<ProductPromotion>> {
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Query(() => Number)
  async totalProductPromotions(): Promise<number> {
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Query(() => ProductPromotionsResponse<ProductPromotion>)
  async searchProductPromotions(
    @Args("where", { type: () => ProductPromotionDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductPromotionsResponse<ProductPromotion>> {
    const productpromotions = await this.service.findAndCount(where);
    return productpromotions;
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Query(() => ProductPromotionResponse<ProductPromotion>, { nullable: true })
  async findOneProductPromotion(
    @Args("where", { type: () => ProductPromotionDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductPromotionResponse<ProductPromotion>> {
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
      .registerClient(ProductPromotionResolver.name)

      .get(ProductPromotionResolver.name),
    })
  @Query(() => ProductPromotionResponse<ProductPromotion>)
  async findOneProductPromotionOrFail(
    @Args("where", { type: () => ProductPromotionDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductPromotionResponse<ProductPromotion> | Error> {
    return this.service.findOneOrFail(where);
  }
}

