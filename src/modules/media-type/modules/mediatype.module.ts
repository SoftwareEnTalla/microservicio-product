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


import { Module } from "@nestjs/common";
import { MediaTypeCommandController } from "../controllers/mediatypecommand.controller";
import { MediaTypeQueryController } from "../controllers/mediatypequery.controller";
import { MediaTypeCommandService } from "../services/mediatypecommand.service";
import { MediaTypeQueryService } from "../services/mediatypequery.service";

import { MediaTypeCommandRepository } from "../repositories/mediatypecommand.repository";
import { MediaTypeQueryRepository } from "../repositories/mediatypequery.repository";
import { MediaTypeRepository } from "../repositories/mediatype.repository";
import { MediaTypeResolver } from "../graphql/mediatype.resolver";
import { MediaTypeAuthGuard } from "../guards/mediatypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaType } from "../entities/media-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateMediaTypeHandler } from "../commands/handlers/createmediatype.handler";
import { UpdateMediaTypeHandler } from "../commands/handlers/updatemediatype.handler";
import { DeleteMediaTypeHandler } from "../commands/handlers/deletemediatype.handler";
import { GetMediaTypeByIdHandler } from "../queries/handlers/getmediatypebyid.handler";
import { GetMediaTypeByFieldHandler } from "../queries/handlers/getmediatypebyfield.handler";
import { GetAllMediaTypeHandler } from "../queries/handlers/getallmediatype.handler";
import { MediaTypeCrudSaga } from "../sagas/mediatype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { MediaTypeInterceptor } from "../interceptors/mediatype.interceptor";
import { MediaTypeLoggingInterceptor } from "../interceptors/mediatype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, MediaType]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [MediaTypeCommandController, MediaTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    MediaTypeQueryService,
    MediaTypeCommandService,
  
    //Repositories
    MediaTypeCommandRepository,
    MediaTypeQueryRepository,
    MediaTypeRepository,      
    //Resolvers
    MediaTypeResolver,
    //Guards
    MediaTypeAuthGuard,
    //Interceptors
    MediaTypeInterceptor,
    MediaTypeLoggingInterceptor,
    //CQRS Handlers
    CreateMediaTypeHandler,
    UpdateMediaTypeHandler,
    DeleteMediaTypeHandler,
    GetMediaTypeByIdHandler,
    GetMediaTypeByFieldHandler,
    GetAllMediaTypeHandler,
    MediaTypeCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    MediaTypeQueryService,
    MediaTypeCommandService,
  
    //Repositories
    MediaTypeCommandRepository,
    MediaTypeQueryRepository,
    MediaTypeRepository,      
    //Resolvers
    MediaTypeResolver,
    //Guards
    MediaTypeAuthGuard,
    //Interceptors
    MediaTypeInterceptor,
    MediaTypeLoggingInterceptor,
  ],
})
export class MediaTypeModule {}

