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
import { ProductVariant } from "../entities/product-variant.entity";

//Definición de comandos
import {
  CreateProductVariantCommand,
  UpdateProductVariantCommand,
  DeleteProductVariantCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProductVariantQueryService } from "../services/productvariantquery.service";


import { ProductVariantResponse, ProductVariantsResponse } from "../types/productvariant.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProductVariantDto, 
CreateOrUpdateProductVariantDto, 
ProductVariantValueInput, 
ProductVariantDto, 
CreateProductVariantDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ProductVariant)
export class ProductVariantResolver {

   //Constructor del resolver de ProductVariant
  constructor(
    private readonly service: ProductVariantQueryService,
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProductVariantResponse<ProductVariant>)
  async createProductVariant(
    @Args("input", { type: () => CreateProductVariantDto }) input: CreateProductVariantDto
  ): Promise<ProductVariantResponse<ProductVariant>> {
    return this.commandBus.execute(new CreateProductVariantCommand(input));
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Mutation(() => ProductVariantResponse<ProductVariant>)
  async updateProductVariant(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProductVariantDto
  ): Promise<ProductVariantResponse<ProductVariant>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProductVariantCommand(payLoad, {
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Mutation(() => ProductVariantResponse<ProductVariant>)
  async createOrUpdateProductVariant(
    @Args("data", { type: () => CreateOrUpdateProductVariantDto })
    data: CreateOrUpdateProductVariantDto
  ): Promise<ProductVariantResponse<ProductVariant>> {
    if (data.id) {
      const existingProductVariant = await this.service.findById(data.id);
      if (existingProductVariant) {
        return this.commandBus.execute(
          new UpdateProductVariantCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProductVariantDto | UpdateProductVariantDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProductVariantCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProductVariantDto | UpdateProductVariantDto).createdBy ||
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProductVariant(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProductVariantCommand(id));
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  // Queries
  @Query(() => ProductVariantsResponse<ProductVariant>)
  async productvariants(
    options?: FindManyOptions<ProductVariant>,
    paginationArgs?: PaginationArgs
  ): Promise<ProductVariantsResponse<ProductVariant>> {
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Query(() => ProductVariantsResponse<ProductVariant>)
  async productvariant(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProductVariantResponse<ProductVariant>> {
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Query(() => ProductVariantsResponse<ProductVariant>)
  async productvariantsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProductVariantValueInput }) value: ProductVariantValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductVariantsResponse<ProductVariant>> {
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Query(() => ProductVariantsResponse<ProductVariant>)
  async productvariantsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProductVariantsResponse<ProductVariant>> {
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Query(() => Number)
  async totalProductVariants(): Promise<number> {
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Query(() => ProductVariantsResponse<ProductVariant>)
  async searchProductVariants(
    @Args("where", { type: () => ProductVariantDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductVariantsResponse<ProductVariant>> {
    const productvariants = await this.service.findAndCount(where);
    return productvariants;
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Query(() => ProductVariantResponse<ProductVariant>, { nullable: true })
  async findOneProductVariant(
    @Args("where", { type: () => ProductVariantDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductVariantResponse<ProductVariant>> {
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
      .registerClient(ProductVariantResolver.name)

      .get(ProductVariantResolver.name),
    })
  @Query(() => ProductVariantResponse<ProductVariant>)
  async findOneProductVariantOrFail(
    @Args("where", { type: () => ProductVariantDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProductVariantResponse<ProductVariant> | Error> {
    return this.service.findOneOrFail(where);
  }
}

