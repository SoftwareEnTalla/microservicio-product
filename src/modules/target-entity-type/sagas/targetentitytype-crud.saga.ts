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
  TargetEntityTypeCreatedEvent,
  TargetEntityTypeUpdatedEvent,
  TargetEntityTypeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaTargetEntityTypeFailedEvent
} from '../events/targetentitytype-failed.event';
import {
  CreateTargetEntityTypeCommand,
  UpdateTargetEntityTypeCommand,
  DeleteTargetEntityTypeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class TargetEntityTypeCrudSaga {
  private readonly logger = new Logger(TargetEntityTypeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onTargetEntityTypeCreated = ($events: Observable<TargetEntityTypeCreatedEvent>) => {
    return $events.pipe(
      ofType(TargetEntityTypeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de TargetEntityType: ${event.aggregateId}`);
        void this.handleTargetEntityTypeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onTargetEntityTypeUpdated = ($events: Observable<TargetEntityTypeUpdatedEvent>) => {
    return $events.pipe(
      ofType(TargetEntityTypeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de TargetEntityType: ${event.aggregateId}`);
        void this.handleTargetEntityTypeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onTargetEntityTypeDeleted = ($events: Observable<TargetEntityTypeDeletedEvent>) => {
    return $events.pipe(
      ofType(TargetEntityTypeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de TargetEntityType: ${event.aggregateId}`);
        void this.handleTargetEntityTypeDeleted(event);
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
      .registerClient(TargetEntityTypeCrudSaga.name)
      .get(TargetEntityTypeCrudSaga.name),
  })
  private async handleTargetEntityTypeCreated(event: TargetEntityTypeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TargetEntityType Created completada: ${event.aggregateId}`);
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
      .registerClient(TargetEntityTypeCrudSaga.name)
      .get(TargetEntityTypeCrudSaga.name),
  })
  private async handleTargetEntityTypeUpdated(event: TargetEntityTypeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TargetEntityType Updated completada: ${event.aggregateId}`);
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
      .registerClient(TargetEntityTypeCrudSaga.name)
      .get(TargetEntityTypeCrudSaga.name),
  })
  private async handleTargetEntityTypeDeleted(event: TargetEntityTypeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TargetEntityType Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaTargetEntityTypeFailedEvent( error,event));
  }
}
