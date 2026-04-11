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


import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { ProductAttributeCommandService } from "../services/productattributecommand.service";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { ProductAttribute } from "../entities/product-attribute.entity";
import { ProductAttributeResponse, ProductAttributesResponse } from "../types/productattribute.types";
import { CreateProductAttributeDto, UpdateProductAttributeDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { ProductAttributeCreatedEvent } from "../events/productattributecreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("ProductAttribute Command")
@Controller("productattributes/command")
export class ProductAttributeCommandController {

  #logger = new Logger(ProductAttributeCommandController.name);

  //Constructor del controlador: ProductAttributeCommandController
  constructor(
  private readonly service: ProductAttributeCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new productattribute" })
  @ApiBody({ type: CreateProductAttributeDto })
  @ApiResponse({ status: 201, type: ProductAttributeResponse<ProductAttribute> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ProductAttributeCommandController.name)
      .get(ProductAttributeCommandController.name),
  })
  async create(
    @Body() createProductAttributeDtoInput: CreateProductAttributeDto
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
    try {
      logger.info("Receiving in controller:", createProductAttributeDtoInput);
      const entity = await this.service.create(createProductAttributeDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response productattribute entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("ProductAttribute entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id productattribute is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple productattributes" })
  @ApiBody({ type: [CreateProductAttributeDto] })
  @ApiResponse({ status: 201, type: ProductAttributesResponse<ProductAttribute> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ProductAttributeCommandController.name)
      .get(ProductAttributeCommandController.name),
  })
  async bulkCreate(
    @Body() createProductAttributeDtosInput: CreateProductAttributeDto[]
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
    try {
      const entities = await this.service.bulkCreate(createProductAttributeDtosInput);

      if (!entities) {
        throw new NotFoundException("ProductAttribute entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an productattribute" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateProductAttributeDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: ProductAttributeResponse<ProductAttribute> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia ProductAttribute a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ProductAttributeCommandController.name)
      .get(ProductAttributeCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<ProductAttributeResponse<ProductAttribute>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs
      if (id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de ProductAttribute a actualizar."
        );
      }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de ProductAttribute no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple productattributes" })
  @ApiBody({ type: [UpdateProductAttributeDto] })
  @ApiResponse({ status: 200, type: ProductAttributesResponse<ProductAttribute> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ProductAttributeCommandController.name)
      .get(ProductAttributeCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateProductAttributeDto[]
  ): Promise<ProductAttributesResponse<ProductAttribute>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("ProductAttribute entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an productattribute" })   
  @ApiResponse({ status: 200, type: ProductAttributeResponse<ProductAttribute>,description:
    "Instancia de ProductAttribute eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia ProductAttribute a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ProductAttributeCommandController.name)
      .get(ProductAttributeCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<ProductAttributeResponse<ProductAttribute>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("ProductAttribute entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple productattributes" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ProductAttributeCommandController.name)
      .get(ProductAttributeCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

