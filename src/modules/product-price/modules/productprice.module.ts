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
import { ProductPriceCommandController } from "../controllers/productpricecommand.controller";
import { ProductPriceQueryController } from "../controllers/productpricequery.controller";
import { ProductPriceCommandService } from "../services/productpricecommand.service";
import { ProductPriceQueryService } from "../services/productpricequery.service";
import { ProductPriceCommandRepository } from "../repositories/productpricecommand.repository";
import { ProductPriceQueryRepository } from "../repositories/productpricequery.repository";
import { ProductPriceRepository } from "../repositories/productprice.repository";
import { ProductPriceResolver } from "../graphql/productprice.resolver";
import { ProductPriceAuthGuard } from "../guards/productpriceauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductPrice } from "../entities/product-price.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductPriceHandler } from "../commands/handlers/createproductprice.handler";
import { UpdateProductPriceHandler } from "../commands/handlers/updateproductprice.handler";
import { DeleteProductPriceHandler } from "../commands/handlers/deleteproductprice.handler";
import { GetProductPriceByIdHandler } from "../queries/handlers/getproductpricebyid.handler";
import { GetProductPriceByFieldHandler } from "../queries/handlers/getproductpricebyfield.handler";
import { GetAllProductPriceHandler } from "../queries/handlers/getallproductprice.handler";
import { ProductPriceCrudSaga } from "../sagas/productprice-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductPriceInterceptor } from "../interceptors/productprice.interceptor";
import { ProductPriceLoggingInterceptor } from "../interceptors/productprice.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductPrice]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductPriceCommandController, ProductPriceQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductPriceQueryService,
    ProductPriceCommandService,
    //Repositories
    ProductPriceCommandRepository,
    ProductPriceQueryRepository,
    ProductPriceRepository,      
    //Resolvers
    ProductPriceResolver,
    //Guards
    ProductPriceAuthGuard,
    //Interceptors
    ProductPriceInterceptor,
    ProductPriceLoggingInterceptor,
    //CQRS Handlers
    CreateProductPriceHandler,
    UpdateProductPriceHandler,
    DeleteProductPriceHandler,
    GetProductPriceByIdHandler,
    GetProductPriceByFieldHandler,
    GetAllProductPriceHandler,
    ProductPriceCrudSaga,
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
    ProductPriceQueryService,
    ProductPriceCommandService,
    //Repositories
    ProductPriceCommandRepository,
    ProductPriceQueryRepository,
    ProductPriceRepository,      
    //Resolvers
    ProductPriceResolver,
    //Guards
    ProductPriceAuthGuard,
    //Interceptors
    ProductPriceInterceptor,
    ProductPriceLoggingInterceptor,
  ],
})
export class ProductPriceModule {}

