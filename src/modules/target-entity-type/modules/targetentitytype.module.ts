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
import { TargetEntityTypeCommandController } from "../controllers/targetentitytypecommand.controller";
import { TargetEntityTypeQueryController } from "../controllers/targetentitytypequery.controller";
import { TargetEntityTypeCommandService } from "../services/targetentitytypecommand.service";
import { TargetEntityTypeQueryService } from "../services/targetentitytypequery.service";

import { TargetEntityTypeCommandRepository } from "../repositories/targetentitytypecommand.repository";
import { TargetEntityTypeQueryRepository } from "../repositories/targetentitytypequery.repository";
import { TargetEntityTypeRepository } from "../repositories/targetentitytype.repository";
import { TargetEntityTypeResolver } from "../graphql/targetentitytype.resolver";
import { TargetEntityTypeAuthGuard } from "../guards/targetentitytypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TargetEntityType } from "../entities/target-entity-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateTargetEntityTypeHandler } from "../commands/handlers/createtargetentitytype.handler";
import { UpdateTargetEntityTypeHandler } from "../commands/handlers/updatetargetentitytype.handler";
import { DeleteTargetEntityTypeHandler } from "../commands/handlers/deletetargetentitytype.handler";
import { GetTargetEntityTypeByIdHandler } from "../queries/handlers/gettargetentitytypebyid.handler";
import { GetTargetEntityTypeByFieldHandler } from "../queries/handlers/gettargetentitytypebyfield.handler";
import { GetAllTargetEntityTypeHandler } from "../queries/handlers/getalltargetentitytype.handler";
import { TargetEntityTypeCrudSaga } from "../sagas/targetentitytype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { TargetEntityTypeInterceptor } from "../interceptors/targetentitytype.interceptor";
import { TargetEntityTypeLoggingInterceptor } from "../interceptors/targetentitytype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, TargetEntityType]), // Incluir BaseEntity para herencia
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
  controllers: [TargetEntityTypeCommandController, TargetEntityTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    TargetEntityTypeQueryService,
    TargetEntityTypeCommandService,
  
    //Repositories
    TargetEntityTypeCommandRepository,
    TargetEntityTypeQueryRepository,
    TargetEntityTypeRepository,      
    //Resolvers
    TargetEntityTypeResolver,
    //Guards
    TargetEntityTypeAuthGuard,
    //Interceptors
    TargetEntityTypeInterceptor,
    TargetEntityTypeLoggingInterceptor,
    //CQRS Handlers
    CreateTargetEntityTypeHandler,
    UpdateTargetEntityTypeHandler,
    DeleteTargetEntityTypeHandler,
    GetTargetEntityTypeByIdHandler,
    GetTargetEntityTypeByFieldHandler,
    GetAllTargetEntityTypeHandler,
    TargetEntityTypeCrudSaga,
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
    TargetEntityTypeQueryService,
    TargetEntityTypeCommandService,
  
    //Repositories
    TargetEntityTypeCommandRepository,
    TargetEntityTypeQueryRepository,
    TargetEntityTypeRepository,      
    //Resolvers
    TargetEntityTypeResolver,
    //Guards
    TargetEntityTypeAuthGuard,
    //Interceptors
    TargetEntityTypeInterceptor,
    TargetEntityTypeLoggingInterceptor,
  ],
})
export class TargetEntityTypeModule {}

