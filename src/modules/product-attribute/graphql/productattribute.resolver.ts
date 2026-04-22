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
import { ProductAttribute } from "../entities/product-attribute.entity";

//Definición de comandos
import {
  CreateProductAttributeCommand,
  UpdateProductAttributeCommand,
  DeleteProductAttributeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductAttributeQueryService } from "../services/productattributequery.service";


import { ProductAttributeResponse, ProductAttributesResponse } from "../types/productattribute.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductAttributeDto, 
CreateOrUpdateProductAttributeDto, 
ProductAttributeValueInput, 
ProductAttributeDto, 
CreateProductAttributeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductAttribute)
export class ProductAttributeResolver {

   //Constructor del resolver de ProductAttribute
  constructor(
    private readonly service: ProductAttributeQueryService,
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductAttributeResponse<ProductAttribute>)
  async createProductAttribute(
    @Args("input", { type: () => CreateProductAttributeDto }) input: CreateProductAttributeDto
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
    return this.commandBus.execute(new CreateProductAttributeCommand(input));
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Mutation(() => ProductAttributeResponse<ProductAttribute>)
  async updateProductAttribute(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductAttributeDto
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductAttributeCommand(payLoad, {
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Mutation(() => ProductAttributeResponse<ProductAttribute>)
  async createOrUpdateProductAttribute(
    @Args("data", { type: () => CreateOrUpdateProductAttributeDto })
    data: CreateOrUpdateProductAttributeDto
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
    if (data.id) {
      const existingProductAttribute = await this.service.findById(data.id);
      if (existingProductAttribute) {
        return this.commandBus.execute(
          new UpdateProductAttributeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductAttributeDto | UpdateProductAttributeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductAttributeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductAttributeDto | UpdateProductAttributeDto).createdBy ||
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductAttribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductAttributeCommand(id));
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  // Queries
  @Query(() => ProductAttributesResponse<ProductAttribute>)
  async productattributes(
    options?: FindManyOptions<ProductAttribute>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Query(() => ProductAttributesResponse<ProductAttribute>)
  async productattribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Query(() => ProductAttributesResponse<ProductAttribute>)
  async productattributesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductAttributeValueInput }) value: ProductAttributeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Query(() => ProductAttributesResponse<ProductAttribute>)
  async productattributesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Query(() => Number)
  async totalProductAttributes(): Promise<number> {
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Query(() => ProductAttributesResponse<ProductAttribute>)
  async searchProductAttributes(
    @Args("where", { type: () => ProductAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
    const productattributes = await this.service.findAndCount(where);
    return productattributes;
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Query(() => ProductAttributeResponse<ProductAttribute>, { nullable: true })
  async findOneProductAttribute(
    @Args("where", { type: () => ProductAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
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
      .registerClient(ProductAttributeResolver.name)

      .get(ProductAttributeResolver.name),
    })
  @Query(() => ProductAttributeResponse<ProductAttribute>)
  async findOneProductAttributeOrFail(
    @Args("where", { type: () => ProductAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductAttributeResponse<ProductAttribute> | Error> {
    return this.service.findOneOrFail(where);
  }
}

