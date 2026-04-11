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
import { ProductSpecification } from "../entities/product-specification.entity";

//Definición de comandos
import {
  CreateProductSpecificationCommand,
  UpdateProductSpecificationCommand,
  DeleteProductSpecificationCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductSpecificationQueryService } from "../services/productspecificationquery.service";


import { ProductSpecificationResponse, ProductSpecificationsResponse } from "../types/productspecification.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductSpecificationDto, 
CreateOrUpdateProductSpecificationDto, 
ProductSpecificationValueInput, 
ProductSpecificationDto, 
CreateProductSpecificationDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductSpecification)
export class ProductSpecificationResolver {

   //Constructor del resolver de ProductSpecification
  constructor(
    private readonly service: ProductSpecificationQueryService,
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductSpecificationResponse<ProductSpecification>)
  async createProductSpecification(
    @Args("input", { type: () => CreateProductSpecificationDto }) input: CreateProductSpecificationDto
  ): Promise<ProductSpecificationResponse<ProductSpecification>> {
    return this.commandBus.execute(new CreateProductSpecificationCommand(input));
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Mutation(() => ProductSpecificationResponse<ProductSpecification>)
  async updateProductSpecification(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductSpecificationDto
  ): Promise<ProductSpecificationResponse<ProductSpecification>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductSpecificationCommand(payLoad, {
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Mutation(() => ProductSpecificationResponse<ProductSpecification>)
  async createOrUpdateProductSpecification(
    @Args("data", { type: () => CreateOrUpdateProductSpecificationDto })
    data: CreateOrUpdateProductSpecificationDto
  ): Promise<ProductSpecificationResponse<ProductSpecification>> {
    if (data.id) {
      const existingProductSpecification = await this.service.findById(data.id);
      if (existingProductSpecification) {
        return this.commandBus.execute(
          new UpdateProductSpecificationCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductSpecificationDto | UpdateProductSpecificationDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductSpecificationCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductSpecificationDto | UpdateProductSpecificationDto).createdBy ||
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductSpecification(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductSpecificationCommand(id));
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  // Queries
  @Query(() => ProductSpecificationsResponse<ProductSpecification>)
  async productspecifications(
    options?: FindManyOptions<ProductSpecification>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductSpecificationsResponse<ProductSpecification>> {
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Query(() => ProductSpecificationsResponse<ProductSpecification>)
  async productspecification(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductSpecificationResponse<ProductSpecification>> {
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Query(() => ProductSpecificationsResponse<ProductSpecification>)
  async productspecificationsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductSpecificationValueInput }) value: ProductSpecificationValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductSpecificationsResponse<ProductSpecification>> {
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Query(() => ProductSpecificationsResponse<ProductSpecification>)
  async productspecificationsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductSpecificationsResponse<ProductSpecification>> {
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Query(() => Number)
  async totalProductSpecifications(): Promise<number> {
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Query(() => ProductSpecificationsResponse<ProductSpecification>)
  async searchProductSpecifications(
    @Args("where", { type: () => ProductSpecificationDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductSpecificationsResponse<ProductSpecification>> {
    const productspecifications = await this.service.findAndCount(where);
    return productspecifications;
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Query(() => ProductSpecificationResponse<ProductSpecification>, { nullable: true })
  async findOneProductSpecification(
    @Args("where", { type: () => ProductSpecificationDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductSpecificationResponse<ProductSpecification>> {
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
      .registerClient(ProductSpecificationResolver.name)

      .get(ProductSpecificationResolver.name),
    })
  @Query(() => ProductSpecificationResponse<ProductSpecification>)
  async findOneProductSpecificationOrFail(
    @Args("where", { type: () => ProductSpecificationDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductSpecificationResponse<ProductSpecification> | Error> {
    return this.service.findOneOrFail(where);
  }
}

