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
import { RelationshipTypeCommandController } from "../controllers/relationshiptypecommand.controller";
import { RelationshipTypeQueryController } from "../controllers/relationshiptypequery.controller";
import { RelationshipTypeCommandService } from "../services/relationshiptypecommand.service";
import { RelationshipTypeQueryService } from "../services/relationshiptypequery.service";

import { RelationshipTypeCommandRepository } from "../repositories/relationshiptypecommand.repository";
import { RelationshipTypeQueryRepository } from "../repositories/relationshiptypequery.repository";
import { RelationshipTypeRepository } from "../repositories/relationshiptype.repository";
import { RelationshipTypeResolver } from "../graphql/relationshiptype.resolver";
import { RelationshipTypeAuthGuard } from "../guards/relationshiptypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RelationshipType } from "../entities/relationship-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateRelationshipTypeHandler } from "../commands/handlers/createrelationshiptype.handler";
import { UpdateRelationshipTypeHandler } from "../commands/handlers/updaterelationshiptype.handler";
import { DeleteRelationshipTypeHandler } from "../commands/handlers/deleterelationshiptype.handler";
import { GetRelationshipTypeByIdHandler } from "../queries/handlers/getrelationshiptypebyid.handler";
import { GetRelationshipTypeByFieldHandler } from "../queries/handlers/getrelationshiptypebyfield.handler";
import { GetAllRelationshipTypeHandler } from "../queries/handlers/getallrelationshiptype.handler";
import { RelationshipTypeCrudSaga } from "../sagas/relationshiptype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { RelationshipTypeInterceptor } from "../interceptors/relationshiptype.interceptor";
import { RelationshipTypeLoggingInterceptor } from "../interceptors/relationshiptype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, RelationshipType]), // Incluir BaseEntity para herencia
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
  controllers: [RelationshipTypeCommandController, RelationshipTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    RelationshipTypeQueryService,
    RelationshipTypeCommandService,
  
    //Repositories
    RelationshipTypeCommandRepository,
    RelationshipTypeQueryRepository,
    RelationshipTypeRepository,      
    //Resolvers
    RelationshipTypeResolver,
    //Guards
    RelationshipTypeAuthGuard,
    //Interceptors
    RelationshipTypeInterceptor,
    RelationshipTypeLoggingInterceptor,
    //CQRS Handlers
    CreateRelationshipTypeHandler,
    UpdateRelationshipTypeHandler,
    DeleteRelationshipTypeHandler,
    GetRelationshipTypeByIdHandler,
    GetRelationshipTypeByFieldHandler,
    GetAllRelationshipTypeHandler,
    RelationshipTypeCrudSaga,
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
    RelationshipTypeQueryService,
    RelationshipTypeCommandService,
  
    //Repositories
    RelationshipTypeCommandRepository,
    RelationshipTypeQueryRepository,
    RelationshipTypeRepository,      
    //Resolvers
    RelationshipTypeResolver,
    //Guards
    RelationshipTypeAuthGuard,
    //Interceptors
    RelationshipTypeInterceptor,
    RelationshipTypeLoggingInterceptor,
  ],
})
export class RelationshipTypeModule {}

