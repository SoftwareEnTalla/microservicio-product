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
import { AppliesToCommandController } from "../controllers/appliestocommand.controller";
import { AppliesToQueryController } from "../controllers/appliestoquery.controller";
import { AppliesToCommandService } from "../services/appliestocommand.service";
import { AppliesToQueryService } from "../services/appliestoquery.service";

import { AppliesToCommandRepository } from "../repositories/appliestocommand.repository";
import { AppliesToQueryRepository } from "../repositories/appliestoquery.repository";
import { AppliesToRepository } from "../repositories/appliesto.repository";
import { AppliesToResolver } from "../graphql/appliesto.resolver";
import { AppliesToAuthGuard } from "../guards/appliestoauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppliesTo } from "../entities/applies-to.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateAppliesToHandler } from "../commands/handlers/createappliesto.handler";
import { UpdateAppliesToHandler } from "../commands/handlers/updateappliesto.handler";
import { DeleteAppliesToHandler } from "../commands/handlers/deleteappliesto.handler";
import { GetAppliesToByIdHandler } from "../queries/handlers/getappliestobyid.handler";
import { GetAppliesToByFieldHandler } from "../queries/handlers/getappliestobyfield.handler";
import { GetAllAppliesToHandler } from "../queries/handlers/getallappliesto.handler";
import { AppliesToCrudSaga } from "../sagas/appliesto-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { AppliesToInterceptor } from "../interceptors/appliesto.interceptor";
import { AppliesToLoggingInterceptor } from "../interceptors/appliesto.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, AppliesTo]), // Incluir BaseEntity para herencia
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
  controllers: [AppliesToCommandController, AppliesToQueryController],
  providers: [
    //Services
    EventStoreService,
    AppliesToQueryService,
    AppliesToCommandService,
  
    //Repositories
    AppliesToCommandRepository,
    AppliesToQueryRepository,
    AppliesToRepository,      
    //Resolvers
    AppliesToResolver,
    //Guards
    AppliesToAuthGuard,
    //Interceptors
    AppliesToInterceptor,
    AppliesToLoggingInterceptor,
    //CQRS Handlers
    CreateAppliesToHandler,
    UpdateAppliesToHandler,
    DeleteAppliesToHandler,
    GetAppliesToByIdHandler,
    GetAppliesToByFieldHandler,
    GetAllAppliesToHandler,
    AppliesToCrudSaga,
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
    AppliesToQueryService,
    AppliesToCommandService,
  
    //Repositories
    AppliesToCommandRepository,
    AppliesToQueryRepository,
    AppliesToRepository,      
    //Resolvers
    AppliesToResolver,
    //Guards
    AppliesToAuthGuard,
    //Interceptors
    AppliesToInterceptor,
    AppliesToLoggingInterceptor,
  ],
})
export class AppliesToModule {}

