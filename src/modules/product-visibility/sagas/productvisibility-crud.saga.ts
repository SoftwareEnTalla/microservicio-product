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
  ProductVisibilityCreatedEvent,
  ProductVisibilityUpdatedEvent,
  ProductVisibilityDeletedEvent,

} from '../events/exporting.event';
import {
  SagaProductVisibilityFailedEvent
} from '../events/productvisibility-failed.event';
import {
  CreateProductVisibilityCommand,
  UpdateProductVisibilityCommand,
  DeleteProductVisibilityCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ProductVisibilityCrudSaga {
  private readonly logger = new Logger(ProductVisibilityCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onProductVisibilityCreated = ($events: Observable<ProductVisibilityCreatedEvent>) => {
    return $events.pipe(
      ofType(ProductVisibilityCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de ProductVisibility: ${event.aggregateId}`);
        void this.handleProductVisibilityCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onProductVisibilityUpdated = ($events: Observable<ProductVisibilityUpdatedEvent>) => {
    return $events.pipe(
      ofType(ProductVisibilityUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de ProductVisibility: ${event.aggregateId}`);
        void this.handleProductVisibilityUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onProductVisibilityDeleted = ($events: Observable<ProductVisibilityDeletedEvent>) => {
    return $events.pipe(
      ofType(ProductVisibilityDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de ProductVisibility: ${event.aggregateId}`);
        void this.handleProductVisibilityDeleted(event);
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
      .registerClient(ProductVisibilityCrudSaga.name)
      .get(ProductVisibilityCrudSaga.name),
  })
  private async handleProductVisibilityCreated(event: ProductVisibilityCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ProductVisibility Created completada: ${event.aggregateId}`);
      // Lógica post-creación (ej: enviar notificación, ejecutar comandos adicionales)
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
      .registerClient(ProductVisibilityCrudSaga.name)
      .get(ProductVisibilityCrudSaga.name),
  })
  private async handleProductVisibilityUpdated(event: ProductVisibilityUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ProductVisibility Updated completada: ${event.aggregateId}`);
      // Lógica post-actualización (ej: actualizar caché)
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
      .registerClient(ProductVisibilityCrudSaga.name)
      .get(ProductVisibilityCrudSaga.name),
  })
  private async handleProductVisibilityDeleted(event: ProductVisibilityDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ProductVisibility Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaProductVisibilityFailedEvent( error,event));
  }
}
