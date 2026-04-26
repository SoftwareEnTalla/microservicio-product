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
import { ProductStatusCommandController } from "../controllers/productstatuscommand.controller";
import { ProductStatusQueryController } from "../controllers/productstatusquery.controller";
import { ProductStatusCommandService } from "../services/productstatuscommand.service";
import { ProductStatusQueryService } from "../services/productstatusquery.service";

import { ProductStatusCommandRepository } from "../repositories/productstatuscommand.repository";
import { ProductStatusQueryRepository } from "../repositories/productstatusquery.repository";
import { ProductStatusRepository } from "../repositories/productstatus.repository";
import { ProductStatusResolver } from "../graphql/productstatus.resolver";
import { ProductStatusAuthGuard } from "../guards/productstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductStatus } from "../entities/product-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductStatusHandler } from "../commands/handlers/createproductstatus.handler";
import { UpdateProductStatusHandler } from "../commands/handlers/updateproductstatus.handler";
import { DeleteProductStatusHandler } from "../commands/handlers/deleteproductstatus.handler";
import { GetProductStatusByIdHandler } from "../queries/handlers/getproductstatusbyid.handler";
import { GetProductStatusByFieldHandler } from "../queries/handlers/getproductstatusbyfield.handler";
import { GetAllProductStatusHandler } from "../queries/handlers/getallproductstatus.handler";
import { ProductStatusCrudSaga } from "../sagas/productstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductStatusInterceptor } from "../interceptors/productstatus.interceptor";
import { ProductStatusLoggingInterceptor } from "../interceptors/productstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductStatus]), // Incluir BaseEntity para herencia
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
  controllers: [ProductStatusCommandController, ProductStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductStatusQueryService,
    ProductStatusCommandService,
  
    //Repositories
    ProductStatusCommandRepository,
    ProductStatusQueryRepository,
    ProductStatusRepository,      
    //Resolvers
    ProductStatusResolver,
    //Guards
    ProductStatusAuthGuard,
    //Interceptors
    ProductStatusInterceptor,
    ProductStatusLoggingInterceptor,
    //CQRS Handlers
    CreateProductStatusHandler,
    UpdateProductStatusHandler,
    DeleteProductStatusHandler,
    GetProductStatusByIdHandler,
    GetProductStatusByFieldHandler,
    GetAllProductStatusHandler,
    ProductStatusCrudSaga,
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
    ProductStatusQueryService,
    ProductStatusCommandService,
  
    //Repositories
    ProductStatusCommandRepository,
    ProductStatusQueryRepository,
    ProductStatusRepository,      
    //Resolvers
    ProductStatusResolver,
    //Guards
    ProductStatusAuthGuard,
    //Interceptors
    ProductStatusInterceptor,
    ProductStatusLoggingInterceptor,
  ],
})
export class ProductStatusModule {}

