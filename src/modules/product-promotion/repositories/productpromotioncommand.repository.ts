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
import { ProductPromotion } from '../entities/product-promotion.entity';
import { ProductPromotionQueryRepository } from './productpromotionquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {ProductPromotionRepository} from './productpromotion.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ProductPromotionCreatedEvent } from '../events/productpromotioncreated.event';
import { ProductPromotionUpdatedEvent } from '../events/productpromotionupdated.event';
import { ProductPromotionDeletedEvent } from '../events/productpromotiondeleted.event';


//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(ProductPromotionCreatedEvent, ProductPromotionUpdatedEvent, ProductPromotionDeletedEvent)
@Injectable()
export class ProductPromotionCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: ProductPromotionCommandRepository
  constructor(
    @InjectRepository(ProductPromotion)
    private readonly repository: Repository<ProductPromotion>,
    private readonly productpromotionRepository: ProductPromotionQueryRepository,
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(ProductPromotion.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${ProductPromotion.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle ProductPromotion event on repository:', event);
    switch (event.constructor.name) {
      case 'ProductPromotionCreatedEvent':
        return await this.onProductPromotionCreated(event);
      case 'ProductPromotionUpdatedEvent':
        return await this.onProductPromotionUpdated(event);
      case 'ProductPromotionDeletedEvent':
        return await this.onProductPromotionDeleted(event);

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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ProductPromotion>('createProductPromotion', args[0], args[1]),
    ttl: 60,
  })
  private async onProductPromotionCreated(event: ProductPromotionCreatedEvent) {
    logger.info('Ready to handle onProductPromotionCreated event on repository:', event);
    const entity = new ProductPromotion();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'productpromotion';
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ProductPromotion>('updateProductPromotion', args[0], args[1]),
    ttl: 60,
  })
  private async onProductPromotionUpdated(event: ProductPromotionUpdatedEvent) {
    logger.info('Ready to handle onProductPromotionUpdated event on repository:', event);
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<ProductPromotion>('deleteProductPromotion', args[0], args[1]),
    ttl: 60,
  })
  private async onProductPromotionDeleted(event: ProductPromotionDeletedEvent) {
    logger.info('Ready to handle onProductPromotionDeleted event on repository:', event);
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductPromotion>('createProductPromotion',args[0], args[1]), ttl: 60 })
  async create(entity: ProductPromotion): Promise<ProductPromotion> {
    logger.info('Ready to create ProductPromotion on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'productpromotion';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of ProductPromotion was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvt1 = new ProductPromotionCreatedEvent(result.id, {
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductPromotion[]>('createProductPromotions',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: ProductPromotion[]): Promise<ProductPromotion[]> {
    logger.info('Ready to create ProductPromotion on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'productpromotion';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of ProductPromotion was created on repository:', result);
    
    // Publicar eventos solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      const __dualEvts2 = result.map((el)=>new ProductPromotionCreatedEvent(el.id, {
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductPromotion>('updateProductPromotion',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<ProductPromotion>
  ): Promise<ProductPromotion | null> {
    logger.info('Ready to update ProductPromotion on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update ProductPromotion on repository was successfully :', partialEntity);
    let instance=await this.productpromotionRepository.findById(id);
    logger.info('Updated instance of ProductPromotion with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event ProductPromotionUpdatedEvent on repository:', instance);
      const __dualEvt3 = new ProductPromotionUpdatedEvent(instance.id, {
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<ProductPromotion[]>('updateProductPromotions',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<ProductPromotion>[]): Promise<ProductPromotion[]> {
    const updatedEntities: ProductPromotion[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const __dualEvt4 = new ProductPromotionUpdatedEvent(updatedEntity.id, {
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteProductPromotion',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.productpromotionRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire ProductPromotionDeletedEvent on repository:', result);
       const __dualEvt5 = new ProductPromotionDeletedEvent(id, {
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
      .registerClient(ProductPromotionRepository.name)
      .get(ProductPromotionRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteProductPromotions',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire ProductPromotionDeletedEvent on repository:', result);
      const __dualEvts6 = await Promise.all(ids.map(async (id) => {
          const entity = await this.productpromotionRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new ProductPromotionDeletedEvent(id, {
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


