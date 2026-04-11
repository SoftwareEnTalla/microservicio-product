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
import { ProductSpecificationCommandController } from "../controllers/productspecificationcommand.controller";
import { ProductSpecificationQueryController } from "../controllers/productspecificationquery.controller";
import { ProductSpecificationCommandService } from "../services/productspecificationcommand.service";
import { ProductSpecificationQueryService } from "../services/productspecificationquery.service";
import { ProductSpecificationCommandRepository } from "../repositories/productspecificationcommand.repository";
import { ProductSpecificationQueryRepository } from "../repositories/productspecificationquery.repository";
import { ProductSpecificationRepository } from "../repositories/productspecification.repository";
import { ProductSpecificationResolver } from "../graphql/productspecification.resolver";
import { ProductSpecificationAuthGuard } from "../guards/productspecificationauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductSpecification } from "../entities/product-specification.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductSpecificationHandler } from "../commands/handlers/createproductspecification.handler";
import { UpdateProductSpecificationHandler } from "../commands/handlers/updateproductspecification.handler";
import { DeleteProductSpecificationHandler } from "../commands/handlers/deleteproductspecification.handler";
import { GetProductSpecificationByIdHandler } from "../queries/handlers/getproductspecificationbyid.handler";
import { GetProductSpecificationByFieldHandler } from "../queries/handlers/getproductspecificationbyfield.handler";
import { GetAllProductSpecificationHandler } from "../queries/handlers/getallproductspecification.handler";
import { ProductSpecificationCrudSaga } from "../sagas/productspecification-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductSpecificationInterceptor } from "../interceptors/productspecification.interceptor";
import { ProductSpecificationLoggingInterceptor } from "../interceptors/productspecification.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductSpecification]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductSpecificationCommandController, ProductSpecificationQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductSpecificationQueryService,
    ProductSpecificationCommandService,
    //Repositories
    ProductSpecificationCommandRepository,
    ProductSpecificationQueryRepository,
    ProductSpecificationRepository,      
    //Resolvers
    ProductSpecificationResolver,
    //Guards
    ProductSpecificationAuthGuard,
    //Interceptors
    ProductSpecificationInterceptor,
    ProductSpecificationLoggingInterceptor,
    //CQRS Handlers
    CreateProductSpecificationHandler,
    UpdateProductSpecificationHandler,
    DeleteProductSpecificationHandler,
    GetProductSpecificationByIdHandler,
    GetProductSpecificationByFieldHandler,
    GetAllProductSpecificationHandler,
    ProductSpecificationCrudSaga,
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
    ProductSpecificationQueryService,
    ProductSpecificationCommandService,
    //Repositories
    ProductSpecificationCommandRepository,
    ProductSpecificationQueryRepository,
    ProductSpecificationRepository,      
    //Resolvers
    ProductSpecificationResolver,
    //Guards
    ProductSpecificationAuthGuard,
    //Interceptors
    ProductSpecificationInterceptor,
    ProductSpecificationLoggingInterceptor,
  ],
})
export class ProductSpecificationModule {}

