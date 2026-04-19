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
import { Injectable, NotFoundException, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { ProductAttribute } from '../entities/product-attribute.entity';
import { ProductAttributeQueryRepository } from './productattributequery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {ProductAttributeRepository} from './productattribute.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ProductAttributeCreatedEvent } from '../events/productattributecreated.event';
import { ProductAttributeUpdatedEvent } from '../events/productattributeupdated.event';
import { ProductAttributeDeletedEvent } from '../events/productattributedeleted.event';


//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(ProductAttributeCreatedEvent, ProductAttributeUpdatedEvent, ProductAttributeDeletedEvent)
@Injectable()
export class ProductAttributeCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: ProductAttributeCommandRepository
  constructor(
    @InjectRepository(ProductAttribute)
    private readonly repository: Repository<ProductAttribute>,
    private readonly productattributeRepository: ProductAttributeQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventBus: EventBus,
    @Optional() @Inject('EVENT_SOURCING_CONFIG') 
    private readonly eventSourcingConfig: EventSourcingConfigOptions = EventSourcingHelper.getDefaultConfig()
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(ProductAttribute.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${ProductAttribute.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  // Helper para determinar si usar Event Sourcing
  private shouldPublishEvent(): boolean {
    return EventSourcingHelper.shouldPublishEvents(this.eventSourcingConfig);
  }

  private shouldUseProjections(): boolean {
    return EventSourcingHelper.shouldUseProjections(this.eventSourcingConfig);
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle ProductAttribute event on repository:', event);
    switch (event.constructor.name) {
      case 'ProductAttributeCreatedEvent':
        return await this.onProductAttributeCreated(event);
      case 'ProductAttributeUpdatedEvent':
        return await this.onProductAttributeUpdated(event);
      case 'ProductAttributeDeletedEvent':
        return await this.onProductAttributeDeleted(event);

    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ProductAttribute>('createProductAttribute', args[0], args[1]),
    ttl: 60,
  })
  private async onProductAttributeCreated(event: ProductAttributeCreatedEvent) {
    logger.info('Ready to handle onProductAttributeCreated event on repository:', event);
    const entity = new ProductAttribute();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'productattribute';
    }
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ProductAttribute>('updateProductAttribute', args[0], args[1]),
    ttl: 60,
  })
  private async onProductAttributeUpdated(event: ProductAttributeUpdatedEvent) {
    logger.info('Ready to handle onProductAttributeUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ProductAttribute>('deleteProductAttribute', args[0], args[1]),
    ttl: 60,
  })
  private async onProductAttributeDeleted(event: ProductAttributeDeletedEvent) {
    logger.info('Ready to handle onProductAttributeDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }



  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductAttribute>('createProductAttribute',args[0], args[1]), ttl: 60 })
  async create(entity: ProductAttribute): Promise<ProductAttribute> {
    logger.info('Ready to create ProductAttribute on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'productattribute';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of ProductAttribute was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvt1 = new ProductAttributeCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      });
      this.eventBus.publish(__dualEvt1);
      this.eventPublisher.publish(__dualEvt1);
    }
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductAttribute[]>('createProductAttributes',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: ProductAttribute[]): Promise<ProductAttribute[]> {
    logger.info('Ready to create ProductAttribute on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'productattribute';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of ProductAttribute was created on repository:', result);
    
    // Publicar eventos solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvts2 = result.map((el)=>new ProductAttributeCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      }));
      __dualEvts2.forEach((ev: any) => this.eventBus.publish(ev));
      this.eventPublisher.publishAll(__dualEvts2);
    }
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductAttribute>('updateProductAttribute',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<ProductAttribute>
  ): Promise<ProductAttribute | null> {
    logger.info('Ready to update ProductAttribute on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update ProductAttribute on repository was successfully :', partialEntity);
    let instance=await this.productattributeRepository.findById(id);
    logger.info('Updated instance of ProductAttribute with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event ProductAttributeUpdatedEvent on repository:', instance);
      const __dualEvt3 = new ProductAttributeUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        });
      this.eventBus.publish(__dualEvt3);
      this.eventPublisher.publish(__dualEvt3);
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductAttribute[]>('updateProductAttributes',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<ProductAttribute>[]): Promise<ProductAttribute[]> {
    const updatedEntities: ProductAttribute[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const __dualEvt4 = new ProductAttributeUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              });
            this.eventBus.publish(__dualEvt4);
            this.eventPublisher.publish(__dualEvt4);
          }
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteProductAttribute',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.productattributeRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire ProductAttributeDeletedEvent on repository:', result);
       const __dualEvt5 = new ProductAttributeDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      });
       this.eventBus.publish(__dualEvt5);
       this.eventPublisher.publish(__dualEvt5);
     }
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(ProductAttributeRepository.name)
      .get(ProductAttributeRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteProductAttributes',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire ProductAttributeDeletedEvent on repository:', result);
      const __dualEvts6 = await Promise.all(ids.map(async (id) => {
          const entity = await this.productattributeRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new ProductAttributeDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
      __dualEvts6.forEach((ev: any) => this.eventBus.publish(ev));
      this.eventPublisher.publishAll(__dualEvts6);
    }
    return result;
  }
}


