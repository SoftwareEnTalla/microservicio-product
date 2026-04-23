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
import { ProductPrice } from "../entities/product-price.entity";

//Definición de comandos
import {
  CreateProductPriceCommand,
  UpdateProductPriceCommand,
  DeleteProductPriceCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductPriceQueryService } from "../services/productpricequery.service";


import { ProductPriceResponse, ProductPricesResponse } from "../types/productprice.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductPriceDto, 
CreateOrUpdateProductPriceDto, 
ProductPriceValueInput, 
ProductPriceDto, 
CreateProductPriceDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductPrice)
export class ProductPriceResolver {

   //Constructor del resolver de ProductPrice
  constructor(
    private readonly service: ProductPriceQueryService,
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductPriceResponse<ProductPrice>)
  async createProductPrice(
    @Args("input", { type: () => CreateProductPriceDto }) input: CreateProductPriceDto
  ): Promise<ProductPriceResponse<ProductPrice>> {
    return this.commandBus.execute(new CreateProductPriceCommand(input));
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Mutation(() => ProductPriceResponse<ProductPrice>)
  async updateProductPrice(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductPriceDto
  ): Promise<ProductPriceResponse<ProductPrice>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductPriceCommand(payLoad, {
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Mutation(() => ProductPriceResponse<ProductPrice>)
  async createOrUpdateProductPrice(
    @Args("data", { type: () => CreateOrUpdateProductPriceDto })
    data: CreateOrUpdateProductPriceDto
  ): Promise<ProductPriceResponse<ProductPrice>> {
    if (data.id) {
      const existingProductPrice = await this.service.findById(data.id);
      if (existingProductPrice) {
        return this.commandBus.execute(
          new UpdateProductPriceCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductPriceDto | UpdateProductPriceDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductPriceCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductPriceDto | UpdateProductPriceDto).createdBy ||
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductPrice(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductPriceCommand(id));
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  // Queries
  @Query(() => ProductPricesResponse<ProductPrice>)
  async productprices(
    options?: FindManyOptions<ProductPrice>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductPricesResponse<ProductPrice>> {
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Query(() => ProductPricesResponse<ProductPrice>)
  async productprice(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductPriceResponse<ProductPrice>> {
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Query(() => ProductPricesResponse<ProductPrice>)
  async productpricesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductPriceValueInput }) value: ProductPriceValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductPricesResponse<ProductPrice>> {
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Query(() => ProductPricesResponse<ProductPrice>)
  async productpricesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductPricesResponse<ProductPrice>> {
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Query(() => Number)
  async totalProductPrices(): Promise<number> {
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Query(() => ProductPricesResponse<ProductPrice>)
  async searchProductPrices(
    @Args("where", { type: () => ProductPriceDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductPricesResponse<ProductPrice>> {
    const productprices = await this.service.findAndCount(where);
    return productprices;
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Query(() => ProductPriceResponse<ProductPrice>, { nullable: true })
  async findOneProductPrice(
    @Args("where", { type: () => ProductPriceDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductPriceResponse<ProductPrice>> {
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
      .registerClient(ProductPriceResolver.name)

      .get(ProductPriceResolver.name),
    })
  @Query(() => ProductPriceResponse<ProductPrice>)
  async findOneProductPriceOrFail(
    @Args("where", { type: () => ProductPriceDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductPriceResponse<ProductPrice> | Error> {
    return this.service.findOneOrFail(where);
  }
}

