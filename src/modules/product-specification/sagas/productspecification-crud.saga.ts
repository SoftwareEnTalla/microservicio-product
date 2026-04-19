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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  ProductSpecificationCreatedEvent,
  ProductSpecificationUpdatedEvent,
  ProductSpecificationDeletedEvent,

} from '../events/exporting.event';
import {
  SagaProductSpecificationFailedEvent
} from '../events/productspecification-failed.event';
import {
  CreateProductSpecificationCommand,
  UpdateProductSpecificationCommand,
  DeleteProductSpecificationCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ProductSpecificationCrudSaga {
  private readonly logger = new Logger(ProductSpecificationCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onProductSpecificationCreated = ($events: Observable<ProductSpecificationCreatedEvent>) => {
    return $events.pipe(
      ofType(ProductSpecificationCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de ProductSpecification: ${event.aggregateId}`);
        void this.handleProductSpecificationCreated(event);
      }),
      map(() => null),
      map(event => {
        // Ejecutar comandos adicionales si es necesario
        return null;
      })
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onProductSpecificationUpdated = ($events: Observable<ProductSpecificationUpdatedEvent>) => {
    return $events.pipe(
      ofType(ProductSpecificationUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de ProductSpecification: ${event.aggregateId}`);
        void this.handleProductSpecificationUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onProductSpecificationDeleted = ($events: Observable<ProductSpecificationDeletedEvent>) => {
    return $events.pipe(
      ofType(ProductSpecificationDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de ProductSpecification: ${event.aggregateId}`);
        void this.handleProductSpecificationDeleted(event);
      }),
      map(() => null),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };



  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductSpecificationCrudSaga.name)
      .get(ProductSpecificationCrudSaga.name),
  })
  private async handleProductSpecificationCreated(event: ProductSpecificationCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ProductSpecification Created completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductSpecificationCrudSaga.name)
      .get(ProductSpecificationCrudSaga.name),
  })
  private async handleProductSpecificationUpdated(event: ProductSpecificationUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ProductSpecification Updated completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductSpecificationCrudSaga.name)
      .get(ProductSpecificationCrudSaga.name),
  })
  private async handleProductSpecificationDeleted(event: ProductSpecificationDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ProductSpecification Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaProductSpecificationFailedEvent( error,event));
  }
}
