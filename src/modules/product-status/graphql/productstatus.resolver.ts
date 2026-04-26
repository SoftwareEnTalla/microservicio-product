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
import { ProductStatus } from "../entities/product-status.entity";

//Definición de comandos
import {
  CreateProductStatusCommand,
  UpdateProductStatusCommand,
  DeleteProductStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductStatusQueryService } from "../services/productstatusquery.service";


import { ProductStatusResponse, ProductStatussResponse } from "../types/productstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductStatusDto, 
CreateOrUpdateProductStatusDto, 
ProductStatusValueInput, 
ProductStatusDto, 
CreateProductStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductStatus)
export class ProductStatusResolver {

   //Constructor del resolver de ProductStatus
  constructor(
    private readonly service: ProductStatusQueryService,
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductStatusResponse<ProductStatus>)
  async createProductStatus(
    @Args("input", { type: () => CreateProductStatusDto }) input: CreateProductStatusDto
  ): Promise<ProductStatusResponse<ProductStatus>> {
    return this.commandBus.execute(new CreateProductStatusCommand(input));
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Mutation(() => ProductStatusResponse<ProductStatus>)
  async updateProductStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductStatusDto
  ): Promise<ProductStatusResponse<ProductStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductStatusCommand(payLoad, {
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Mutation(() => ProductStatusResponse<ProductStatus>)
  async createOrUpdateProductStatus(
    @Args("data", { type: () => CreateOrUpdateProductStatusDto })
    data: CreateOrUpdateProductStatusDto
  ): Promise<ProductStatusResponse<ProductStatus>> {
    if (data.id) {
      const existingProductStatus = await this.service.findById(data.id);
      if (existingProductStatus) {
        return this.commandBus.execute(
          new UpdateProductStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductStatusDto | UpdateProductStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductStatusDto | UpdateProductStatusDto).createdBy ||
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductStatusCommand(id));
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  // Queries
  @Query(() => ProductStatussResponse<ProductStatus>)
  async productstatuss(
    options?: FindManyOptions<ProductStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductStatussResponse<ProductStatus>> {
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Query(() => ProductStatussResponse<ProductStatus>)
  async productstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductStatusResponse<ProductStatus>> {
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Query(() => ProductStatussResponse<ProductStatus>)
  async productstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductStatusValueInput }) value: ProductStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductStatussResponse<ProductStatus>> {
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Query(() => ProductStatussResponse<ProductStatus>)
  async productstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductStatussResponse<ProductStatus>> {
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Query(() => Number)
  async totalProductStatuss(): Promise<number> {
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Query(() => ProductStatussResponse<ProductStatus>)
  async searchProductStatuss(
    @Args("where", { type: () => ProductStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductStatussResponse<ProductStatus>> {
    const productstatuss = await this.service.findAndCount(where);
    return productstatuss;
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Query(() => ProductStatusResponse<ProductStatus>, { nullable: true })
  async findOneProductStatus(
    @Args("where", { type: () => ProductStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductStatusResponse<ProductStatus>> {
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
      .registerClient(ProductStatusResolver.name)

      .get(ProductStatusResolver.name),
    })
  @Query(() => ProductStatusResponse<ProductStatus>)
  async findOneProductStatusOrFail(
    @Args("where", { type: () => ProductStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductStatusResponse<ProductStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

