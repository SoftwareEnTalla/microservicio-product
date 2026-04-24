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
import { ProductCommandController } from "../controllers/productcommand.controller";
import { ProductQueryController } from "../controllers/productquery.controller";
import { ProductCommandService } from "../services/productcommand.service";
import { ProductQueryService } from "../services/productquery.service";
import { ProductCommandRepository } from "../repositories/productcommand.repository";
import { ProductQueryRepository } from "../repositories/productquery.repository";
import { ProductRepository } from "../repositories/product.repository";
import { ProductResolver } from "../graphql/product.resolver";
import { ProductAuthGuard } from "../guards/productauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductHandler } from "../commands/handlers/createproduct.handler";
import { UpdateProductHandler } from "../commands/handlers/updateproduct.handler";
import { DeleteProductHandler } from "../commands/handlers/deleteproduct.handler";
import { GetProductByIdHandler } from "../queries/handlers/getproductbyid.handler";
import { GetProductByFieldHandler } from "../queries/handlers/getproductbyfield.handler";
import { GetAllProductHandler } from "../queries/handlers/getallproduct.handler";
import { ProductCrudSaga } from "../sagas/product-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductInterceptor } from "../interceptors/product.interceptor";
import { ProductLoggingInterceptor } from "../interceptors/product.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { SemanticSearchModule } from "src/shared/semantic-search/semantic-search.module";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Product]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
    SemanticSearchModule,
  ],
  controllers: [ProductCommandController, ProductQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductQueryService,
    ProductCommandService,
    //Repositories
    ProductCommandRepository,
    ProductQueryRepository,
    ProductRepository,      
    //Resolvers
    ProductResolver,
    //Guards
    ProductAuthGuard,
    //Interceptors
    ProductInterceptor,
    ProductLoggingInterceptor,
    //CQRS Handlers
    CreateProductHandler,
    UpdateProductHandler,
    DeleteProductHandler,
    GetProductByIdHandler,
    GetProductByFieldHandler,
    GetAllProductHandler,
    ProductCrudSaga,
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
    ProductQueryService,
    ProductCommandService,
    //Repositories
    ProductCommandRepository,
    ProductQueryRepository,
    ProductRepository,      
    //Resolvers
    ProductResolver,
    //Guards
    ProductAuthGuard,
    //Interceptors
    ProductInterceptor,
    ProductLoggingInterceptor,
  ],
})
export class ProductModule {}

