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
import { ProductVariantCommandController } from "../controllers/productvariantcommand.controller";
import { ProductVariantQueryController } from "../controllers/productvariantquery.controller";
import { ProductVariantCommandService } from "../services/productvariantcommand.service";
import { ProductVariantQueryService } from "../services/productvariantquery.service";
import { ProductVariantCommandRepository } from "../repositories/productvariantcommand.repository";
import { ProductVariantQueryRepository } from "../repositories/productvariantquery.repository";
import { ProductVariantRepository } from "../repositories/productvariant.repository";
import { ProductVariantResolver } from "../graphql/productvariant.resolver";
import { ProductVariantAuthGuard } from "../guards/productvariantauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductVariant } from "../entities/product-variant.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductVariantHandler } from "../commands/handlers/createproductvariant.handler";
import { UpdateProductVariantHandler } from "../commands/handlers/updateproductvariant.handler";
import { DeleteProductVariantHandler } from "../commands/handlers/deleteproductvariant.handler";
import { GetProductVariantByIdHandler } from "../queries/handlers/getproductvariantbyid.handler";
import { GetProductVariantByFieldHandler } from "../queries/handlers/getproductvariantbyfield.handler";
import { GetAllProductVariantHandler } from "../queries/handlers/getallproductvariant.handler";
import { ProductVariantCrudSaga } from "../sagas/productvariant-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductVariantInterceptor } from "../interceptors/productvariant.interceptor";
import { ProductVariantLoggingInterceptor } from "../interceptors/productvariant.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductVariant]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductVariantCommandController, ProductVariantQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductVariantQueryService,
    ProductVariantCommandService,
    //Repositories
    ProductVariantCommandRepository,
    ProductVariantQueryRepository,
    ProductVariantRepository,      
    //Resolvers
    ProductVariantResolver,
    //Guards
    ProductVariantAuthGuard,
    //Interceptors
    ProductVariantInterceptor,
    ProductVariantLoggingInterceptor,
    //CQRS Handlers
    CreateProductVariantHandler,
    UpdateProductVariantHandler,
    DeleteProductVariantHandler,
    GetProductVariantByIdHandler,
    GetProductVariantByFieldHandler,
    GetAllProductVariantHandler,
    ProductVariantCrudSaga,
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
    ProductVariantQueryService,
    ProductVariantCommandService,
    //Repositories
    ProductVariantCommandRepository,
    ProductVariantQueryRepository,
    ProductVariantRepository,      
    //Resolvers
    ProductVariantResolver,
    //Guards
    ProductVariantAuthGuard,
    //Interceptors
    ProductVariantInterceptor,
    ProductVariantLoggingInterceptor,
  ],
})
export class ProductVariantModule {}

