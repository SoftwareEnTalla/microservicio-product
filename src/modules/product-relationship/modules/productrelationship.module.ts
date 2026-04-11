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
import { ProductRelationshipCommandController } from "../controllers/productrelationshipcommand.controller";
import { ProductRelationshipQueryController } from "../controllers/productrelationshipquery.controller";
import { ProductRelationshipCommandService } from "../services/productrelationshipcommand.service";
import { ProductRelationshipQueryService } from "../services/productrelationshipquery.service";
import { ProductRelationshipCommandRepository } from "../repositories/productrelationshipcommand.repository";
import { ProductRelationshipQueryRepository } from "../repositories/productrelationshipquery.repository";
import { ProductRelationshipRepository } from "../repositories/productrelationship.repository";
import { ProductRelationshipResolver } from "../graphql/productrelationship.resolver";
import { ProductRelationshipAuthGuard } from "../guards/productrelationshipauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductRelationship } from "../entities/product-relationship.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductRelationshipHandler } from "../commands/handlers/createproductrelationship.handler";
import { UpdateProductRelationshipHandler } from "../commands/handlers/updateproductrelationship.handler";
import { DeleteProductRelationshipHandler } from "../commands/handlers/deleteproductrelationship.handler";
import { GetProductRelationshipByIdHandler } from "../queries/handlers/getproductrelationshipbyid.handler";
import { GetProductRelationshipByFieldHandler } from "../queries/handlers/getproductrelationshipbyfield.handler";
import { GetAllProductRelationshipHandler } from "../queries/handlers/getallproductrelationship.handler";
import { ProductRelationshipCrudSaga } from "../sagas/productrelationship-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductRelationshipInterceptor } from "../interceptors/productrelationship.interceptor";
import { ProductRelationshipLoggingInterceptor } from "../interceptors/productrelationship.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductRelationship]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductRelationshipCommandController, ProductRelationshipQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductRelationshipQueryService,
    ProductRelationshipCommandService,
    //Repositories
    ProductRelationshipCommandRepository,
    ProductRelationshipQueryRepository,
    ProductRelationshipRepository,      
    //Resolvers
    ProductRelationshipResolver,
    //Guards
    ProductRelationshipAuthGuard,
    //Interceptors
    ProductRelationshipInterceptor,
    ProductRelationshipLoggingInterceptor,
    //CQRS Handlers
    CreateProductRelationshipHandler,
    UpdateProductRelationshipHandler,
    DeleteProductRelationshipHandler,
    GetProductRelationshipByIdHandler,
    GetProductRelationshipByFieldHandler,
    GetAllProductRelationshipHandler,
    ProductRelationshipCrudSaga,
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
    ProductRelationshipQueryService,
    ProductRelationshipCommandService,
    //Repositories
    ProductRelationshipCommandRepository,
    ProductRelationshipQueryRepository,
    ProductRelationshipRepository,      
    //Resolvers
    ProductRelationshipResolver,
    //Guards
    ProductRelationshipAuthGuard,
    //Interceptors
    ProductRelationshipInterceptor,
    ProductRelationshipLoggingInterceptor,
  ],
})
export class ProductRelationshipModule {}

