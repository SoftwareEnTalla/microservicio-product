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
import { ProductInventory } from "../entities/product-inventory.entity";

//Definición de comandos
import {
  CreateProductInventoryCommand,
  UpdateProductInventoryCommand,
  DeleteProductInventoryCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductInventoryQueryService } from "../services/productinventoryquery.service";


import { ProductInventoryResponse, ProductInventorysResponse } from "../types/productinventory.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductInventoryDto, 
CreateOrUpdateProductInventoryDto, 
ProductInventoryValueInput, 
ProductInventoryDto, 
CreateProductInventoryDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductInventory)
export class ProductInventoryResolver {

   //Constructor del resolver de ProductInventory
  constructor(
    private readonly service: ProductInventoryQueryService,
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductInventoryResponse<ProductInventory>)
  async createProductInventory(
    @Args("input", { type: () => CreateProductInventoryDto }) input: CreateProductInventoryDto
  ): Promise<ProductInventoryResponse<ProductInventory>> {
    return this.commandBus.execute(new CreateProductInventoryCommand(input));
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Mutation(() => ProductInventoryResponse<ProductInventory>)
  async updateProductInventory(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductInventoryDto
  ): Promise<ProductInventoryResponse<ProductInventory>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductInventoryCommand(payLoad, {
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Mutation(() => ProductInventoryResponse<ProductInventory>)
  async createOrUpdateProductInventory(
    @Args("data", { type: () => CreateOrUpdateProductInventoryDto })
    data: CreateOrUpdateProductInventoryDto
  ): Promise<ProductInventoryResponse<ProductInventory>> {
    if (data.id) {
      const existingProductInventory = await this.service.findById(data.id);
      if (existingProductInventory) {
        return this.commandBus.execute(
          new UpdateProductInventoryCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductInventoryDto | UpdateProductInventoryDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductInventoryCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductInventoryDto | UpdateProductInventoryDto).createdBy ||
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductInventory(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductInventoryCommand(id));
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  // Queries
  @Query(() => ProductInventorysResponse<ProductInventory>)
  async productinventorys(
    options?: FindManyOptions<ProductInventory>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductInventorysResponse<ProductInventory>> {
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Query(() => ProductInventorysResponse<ProductInventory>)
  async productinventory(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductInventoryResponse<ProductInventory>> {
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Query(() => ProductInventorysResponse<ProductInventory>)
  async productinventorysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductInventoryValueInput }) value: ProductInventoryValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductInventorysResponse<ProductInventory>> {
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Query(() => ProductInventorysResponse<ProductInventory>)
  async productinventorysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductInventorysResponse<ProductInventory>> {
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Query(() => Number)
  async totalProductInventorys(): Promise<number> {
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Query(() => ProductInventorysResponse<ProductInventory>)
  async searchProductInventorys(
    @Args("where", { type: () => ProductInventoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductInventorysResponse<ProductInventory>> {
    const productinventorys = await this.service.findAndCount(where);
    return productinventorys;
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Query(() => ProductInventoryResponse<ProductInventory>, { nullable: true })
  async findOneProductInventory(
    @Args("where", { type: () => ProductInventoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductInventoryResponse<ProductInventory>> {
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
      .registerClient(ProductInventoryResolver.name)

      .get(ProductInventoryResolver.name),
    })
  @Query(() => ProductInventoryResponse<ProductInventory>)
  async findOneProductInventoryOrFail(
    @Args("where", { type: () => ProductInventoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductInventoryResponse<ProductInventory> | Error> {
    return this.service.findOneOrFail(where);
  }
}

