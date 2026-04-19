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
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductDeletedEvent,
  ProductActivatedEvent,
} from '../events/exporting.event';
import {
  SagaProductFailedEvent
} from '../events/product-failed.event';
import {
  CreateProductCommand,
  UpdateProductCommand,
  DeleteProductCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ProductCrudSaga {
  private readonly logger = new Logger(ProductCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onProductCreated = ($events: Observable<ProductCreatedEvent>) => {
    return $events.pipe(
      ofType(ProductCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Product: ${event.aggregateId}`);
        void this.handleProductCreated(event);
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
  onProductUpdated = ($events: Observable<ProductUpdatedEvent>) => {
    return $events.pipe(
      ofType(ProductUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Product: ${event.aggregateId}`);
        void this.handleProductUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onProductDeleted = ($events: Observable<ProductDeletedEvent>) => {
    return $events.pipe(
      ofType(ProductDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Product: ${event.aggregateId}`);
        void this.handleProductDeleted(event);
      }),
      map(() => null),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };

  @Saga()
  onProductActivated = ($events: Observable<ProductActivatedEvent>) => {
    return $events.pipe(
      ofType(ProductActivatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ProductActivated: ${event.aggregateId}`);
      }),
      map(() => null)
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
      .registerClient(ProductCrudSaga.name)
      .get(ProductCrudSaga.name),
  })
  private async handleProductCreated(event: ProductCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Product Created completada: ${event.aggregateId}`);
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
      .registerClient(ProductCrudSaga.name)
      .get(ProductCrudSaga.name),
  })
  private async handleProductUpdated(event: ProductUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Product Updated completada: ${event.aggregateId}`);
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
      .registerClient(ProductCrudSaga.name)
      .get(ProductCrudSaga.name),
  })
  private async handleProductDeleted(event: ProductDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Product Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaProductFailedEvent( error,event));
  }
}
