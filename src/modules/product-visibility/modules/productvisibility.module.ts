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
import { ProductVisibilityCommandController } from "../controllers/productvisibilitycommand.controller";
import { ProductVisibilityQueryController } from "../controllers/productvisibilityquery.controller";
import { ProductVisibilityCommandService } from "../services/productvisibilitycommand.service";
import { ProductVisibilityQueryService } from "../services/productvisibilityquery.service";

import { ProductVisibilityCommandRepository } from "../repositories/productvisibilitycommand.repository";
import { ProductVisibilityQueryRepository } from "../repositories/productvisibilityquery.repository";
import { ProductVisibilityRepository } from "../repositories/productvisibility.repository";
import { ProductVisibilityResolver } from "../graphql/productvisibility.resolver";
import { ProductVisibilityAuthGuard } from "../guards/productvisibilityauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductVisibility } from "../entities/product-visibility.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductVisibilityHandler } from "../commands/handlers/createproductvisibility.handler";
import { UpdateProductVisibilityHandler } from "../commands/handlers/updateproductvisibility.handler";
import { DeleteProductVisibilityHandler } from "../commands/handlers/deleteproductvisibility.handler";
import { GetProductVisibilityByIdHandler } from "../queries/handlers/getproductvisibilitybyid.handler";
import { GetProductVisibilityByFieldHandler } from "../queries/handlers/getproductvisibilitybyfield.handler";
import { GetAllProductVisibilityHandler } from "../queries/handlers/getallproductvisibility.handler";
import { ProductVisibilityCrudSaga } from "../sagas/productvisibility-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductVisibilityInterceptor } from "../interceptors/productvisibility.interceptor";
import { ProductVisibilityLoggingInterceptor } from "../interceptors/productvisibility.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductVisibility]), // Incluir BaseEntity para herencia
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
  controllers: [ProductVisibilityCommandController, ProductVisibilityQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductVisibilityQueryService,
    ProductVisibilityCommandService,
  
    //Repositories
    ProductVisibilityCommandRepository,
    ProductVisibilityQueryRepository,
    ProductVisibilityRepository,      
    //Resolvers
    ProductVisibilityResolver,
    //Guards
    ProductVisibilityAuthGuard,
    //Interceptors
    ProductVisibilityInterceptor,
    ProductVisibilityLoggingInterceptor,
    //CQRS Handlers
    CreateProductVisibilityHandler,
    UpdateProductVisibilityHandler,
    DeleteProductVisibilityHandler,
    GetProductVisibilityByIdHandler,
    GetProductVisibilityByFieldHandler,
    GetAllProductVisibilityHandler,
    ProductVisibilityCrudSaga,
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
    ProductVisibilityQueryService,
    ProductVisibilityCommandService,
  
    //Repositories
    ProductVisibilityCommandRepository,
    ProductVisibilityQueryRepository,
    ProductVisibilityRepository,      
    //Resolvers
    ProductVisibilityResolver,
    //Guards
    ProductVisibilityAuthGuard,
    //Interceptors
    ProductVisibilityInterceptor,
    ProductVisibilityLoggingInterceptor,
  ],
})
export class ProductVisibilityModule {}

