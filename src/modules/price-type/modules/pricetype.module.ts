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
import { PriceTypeCommandController } from "../controllers/pricetypecommand.controller";
import { PriceTypeQueryController } from "../controllers/pricetypequery.controller";
import { PriceTypeCommandService } from "../services/pricetypecommand.service";
import { PriceTypeQueryService } from "../services/pricetypequery.service";

import { PriceTypeCommandRepository } from "../repositories/pricetypecommand.repository";
import { PriceTypeQueryRepository } from "../repositories/pricetypequery.repository";
import { PriceTypeRepository } from "../repositories/pricetype.repository";
import { PriceTypeResolver } from "../graphql/pricetype.resolver";
import { PriceTypeAuthGuard } from "../guards/pricetypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PriceType } from "../entities/price-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePriceTypeHandler } from "../commands/handlers/createpricetype.handler";
import { UpdatePriceTypeHandler } from "../commands/handlers/updatepricetype.handler";
import { DeletePriceTypeHandler } from "../commands/handlers/deletepricetype.handler";
import { GetPriceTypeByIdHandler } from "../queries/handlers/getpricetypebyid.handler";
import { GetPriceTypeByFieldHandler } from "../queries/handlers/getpricetypebyfield.handler";
import { GetAllPriceTypeHandler } from "../queries/handlers/getallpricetype.handler";
import { PriceTypeCrudSaga } from "../sagas/pricetype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PriceTypeInterceptor } from "../interceptors/pricetype.interceptor";
import { PriceTypeLoggingInterceptor } from "../interceptors/pricetype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PriceType]), // Incluir BaseEntity para herencia
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
  controllers: [PriceTypeCommandController, PriceTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    PriceTypeQueryService,
    PriceTypeCommandService,
  
    //Repositories
    PriceTypeCommandRepository,
    PriceTypeQueryRepository,
    PriceTypeRepository,      
    //Resolvers
    PriceTypeResolver,
    //Guards
    PriceTypeAuthGuard,
    //Interceptors
    PriceTypeInterceptor,
    PriceTypeLoggingInterceptor,
    //CQRS Handlers
    CreatePriceTypeHandler,
    UpdatePriceTypeHandler,
    DeletePriceTypeHandler,
    GetPriceTypeByIdHandler,
    GetPriceTypeByFieldHandler,
    GetAllPriceTypeHandler,
    PriceTypeCrudSaga,
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
    PriceTypeQueryService,
    PriceTypeCommandService,
  
    //Repositories
    PriceTypeCommandRepository,
    PriceTypeQueryRepository,
    PriceTypeRepository,      
    //Resolvers
    PriceTypeResolver,
    //Guards
    PriceTypeAuthGuard,
    //Interceptors
    PriceTypeInterceptor,
    PriceTypeLoggingInterceptor,
  ],
})
export class PriceTypeModule {}

