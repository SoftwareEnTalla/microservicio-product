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
import { StockStatusCommandController } from "../controllers/stockstatuscommand.controller";
import { StockStatusQueryController } from "../controllers/stockstatusquery.controller";
import { StockStatusCommandService } from "../services/stockstatuscommand.service";
import { StockStatusQueryService } from "../services/stockstatusquery.service";

import { StockStatusCommandRepository } from "../repositories/stockstatuscommand.repository";
import { StockStatusQueryRepository } from "../repositories/stockstatusquery.repository";
import { StockStatusRepository } from "../repositories/stockstatus.repository";
import { StockStatusResolver } from "../graphql/stockstatus.resolver";
import { StockStatusAuthGuard } from "../guards/stockstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StockStatus } from "../entities/stock-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateStockStatusHandler } from "../commands/handlers/createstockstatus.handler";
import { UpdateStockStatusHandler } from "../commands/handlers/updatestockstatus.handler";
import { DeleteStockStatusHandler } from "../commands/handlers/deletestockstatus.handler";
import { GetStockStatusByIdHandler } from "../queries/handlers/getstockstatusbyid.handler";
import { GetStockStatusByFieldHandler } from "../queries/handlers/getstockstatusbyfield.handler";
import { GetAllStockStatusHandler } from "../queries/handlers/getallstockstatus.handler";
import { StockStatusCrudSaga } from "../sagas/stockstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { StockStatusInterceptor } from "../interceptors/stockstatus.interceptor";
import { StockStatusLoggingInterceptor } from "../interceptors/stockstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, StockStatus]), // Incluir BaseEntity para herencia
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
  controllers: [StockStatusCommandController, StockStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    StockStatusQueryService,
    StockStatusCommandService,
  
    //Repositories
    StockStatusCommandRepository,
    StockStatusQueryRepository,
    StockStatusRepository,      
    //Resolvers
    StockStatusResolver,
    //Guards
    StockStatusAuthGuard,
    //Interceptors
    StockStatusInterceptor,
    StockStatusLoggingInterceptor,
    //CQRS Handlers
    CreateStockStatusHandler,
    UpdateStockStatusHandler,
    DeleteStockStatusHandler,
    GetStockStatusByIdHandler,
    GetStockStatusByFieldHandler,
    GetAllStockStatusHandler,
    StockStatusCrudSaga,
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
    StockStatusQueryService,
    StockStatusCommandService,
  
    //Repositories
    StockStatusCommandRepository,
    StockStatusQueryRepository,
    StockStatusRepository,      
    //Resolvers
    StockStatusResolver,
    //Guards
    StockStatusAuthGuard,
    //Interceptors
    StockStatusInterceptor,
    StockStatusLoggingInterceptor,
  ],
})
export class StockStatusModule {}

