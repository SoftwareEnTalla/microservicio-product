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
  MediaTypeCreatedEvent,
  MediaTypeUpdatedEvent,
  MediaTypeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaMediaTypeFailedEvent
} from '../events/mediatype-failed.event';
import {
  CreateMediaTypeCommand,
  UpdateMediaTypeCommand,
  DeleteMediaTypeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class MediaTypeCrudSaga {
  private readonly logger = new Logger(MediaTypeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onMediaTypeCreated = ($events: Observable<MediaTypeCreatedEvent>) => {
    return $events.pipe(
      ofType(MediaTypeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de MediaType: ${event.aggregateId}`);
        void this.handleMediaTypeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onMediaTypeUpdated = ($events: Observable<MediaTypeUpdatedEvent>) => {
    return $events.pipe(
      ofType(MediaTypeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de MediaType: ${event.aggregateId}`);
        void this.handleMediaTypeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onMediaTypeDeleted = ($events: Observable<MediaTypeDeletedEvent>) => {
    return $events.pipe(
      ofType(MediaTypeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de MediaType: ${event.aggregateId}`);
        void this.handleMediaTypeDeleted(event);
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
      .registerClient(MediaTypeCrudSaga.name)
      .get(MediaTypeCrudSaga.name),
  })
  private async handleMediaTypeCreated(event: MediaTypeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MediaType Created completada: ${event.aggregateId}`);
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
      .registerClient(MediaTypeCrudSaga.name)
      .get(MediaTypeCrudSaga.name),
  })
  private async handleMediaTypeUpdated(event: MediaTypeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MediaType Updated completada: ${event.aggregateId}`);
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
      .registerClient(MediaTypeCrudSaga.name)
      .get(MediaTypeCrudSaga.name),
  })
  private async handleMediaTypeDeleted(event: MediaTypeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MediaType Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaMediaTypeFailedEvent( error,event));
  }
}
