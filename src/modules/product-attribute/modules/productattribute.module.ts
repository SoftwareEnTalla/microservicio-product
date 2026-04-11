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
import { ProductAttributeCommandController } from "../controllers/productattributecommand.controller";
import { ProductAttributeQueryController } from "../controllers/productattributequery.controller";
import { ProductAttributeCommandService } from "../services/productattributecommand.service";
import { ProductAttributeQueryService } from "../services/productattributequery.service";
import { ProductAttributeCommandRepository } from "../repositories/productattributecommand.repository";
import { ProductAttributeQueryRepository } from "../repositories/productattributequery.repository";
import { ProductAttributeRepository } from "../repositories/productattribute.repository";
import { ProductAttributeResolver } from "../graphql/productattribute.resolver";
import { ProductAttributeAuthGuard } from "../guards/productattributeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductAttribute } from "../entities/product-attribute.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductAttributeHandler } from "../commands/handlers/createproductattribute.handler";
import { UpdateProductAttributeHandler } from "../commands/handlers/updateproductattribute.handler";
import { DeleteProductAttributeHandler } from "../commands/handlers/deleteproductattribute.handler";
import { GetProductAttributeByIdHandler } from "../queries/handlers/getproductattributebyid.handler";
import { GetProductAttributeByFieldHandler } from "../queries/handlers/getproductattributebyfield.handler";
import { GetAllProductAttributeHandler } from "../queries/handlers/getallproductattribute.handler";
import { ProductAttributeCrudSaga } from "../sagas/productattribute-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductAttributeInterceptor } from "../interceptors/productattribute.interceptor";
import { ProductAttributeLoggingInterceptor } from "../interceptors/productattribute.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductAttribute]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductAttributeCommandController, ProductAttributeQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductAttributeQueryService,
    ProductAttributeCommandService,
    //Repositories
    ProductAttributeCommandRepository,
    ProductAttributeQueryRepository,
    ProductAttributeRepository,      
    //Resolvers
    ProductAttributeResolver,
    //Guards
    ProductAttributeAuthGuard,
    //Interceptors
    ProductAttributeInterceptor,
    ProductAttributeLoggingInterceptor,
    //CQRS Handlers
    CreateProductAttributeHandler,
    UpdateProductAttributeHandler,
    DeleteProductAttributeHandler,
    GetProductAttributeByIdHandler,
    GetProductAttributeByFieldHandler,
    GetAllProductAttributeHandler,
    ProductAttributeCrudSaga,
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
    ProductAttributeQueryService,
    ProductAttributeCommandService,
    //Repositories
    ProductAttributeCommandRepository,
    ProductAttributeQueryRepository,
    ProductAttributeRepository,      
    //Resolvers
    ProductAttributeResolver,
    //Guards
    ProductAttributeAuthGuard,
    //Interceptors
    ProductAttributeInterceptor,
    ProductAttributeLoggingInterceptor,
  ],
})
export class ProductAttributeModule {}

