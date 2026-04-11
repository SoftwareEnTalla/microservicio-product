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
import { ProductMediaCommandController } from "../controllers/productmediacommand.controller";
import { ProductMediaQueryController } from "../controllers/productmediaquery.controller";
import { ProductMediaCommandService } from "../services/productmediacommand.service";
import { ProductMediaQueryService } from "../services/productmediaquery.service";
import { ProductMediaCommandRepository } from "../repositories/productmediacommand.repository";
import { ProductMediaQueryRepository } from "../repositories/productmediaquery.repository";
import { ProductMediaRepository } from "../repositories/productmedia.repository";
import { ProductMediaResolver } from "../graphql/productmedia.resolver";
import { ProductMediaAuthGuard } from "../guards/productmediaauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductMedia } from "../entities/product-media.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductMediaHandler } from "../commands/handlers/createproductmedia.handler";
import { UpdateProductMediaHandler } from "../commands/handlers/updateproductmedia.handler";
import { DeleteProductMediaHandler } from "../commands/handlers/deleteproductmedia.handler";
import { GetProductMediaByIdHandler } from "../queries/handlers/getproductmediabyid.handler";
import { GetProductMediaByFieldHandler } from "../queries/handlers/getproductmediabyfield.handler";
import { GetAllProductMediaHandler } from "../queries/handlers/getallproductmedia.handler";
import { ProductMediaCrudSaga } from "../sagas/productmedia-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductMediaInterceptor } from "../interceptors/productmedia.interceptor";
import { ProductMediaLoggingInterceptor } from "../interceptors/productmedia.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductMedia]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductMediaCommandController, ProductMediaQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductMediaQueryService,
    ProductMediaCommandService,
    //Repositories
    ProductMediaCommandRepository,
    ProductMediaQueryRepository,
    ProductMediaRepository,      
    //Resolvers
    ProductMediaResolver,
    //Guards
    ProductMediaAuthGuard,
    //Interceptors
    ProductMediaInterceptor,
    ProductMediaLoggingInterceptor,
    //CQRS Handlers
    CreateProductMediaHandler,
    UpdateProductMediaHandler,
    DeleteProductMediaHandler,
    GetProductMediaByIdHandler,
    GetProductMediaByFieldHandler,
    GetAllProductMediaHandler,
    ProductMediaCrudSaga,
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
    ProductMediaQueryService,
    ProductMediaCommandService,
    //Repositories
    ProductMediaCommandRepository,
    ProductMediaQueryRepository,
    ProductMediaRepository,      
    //Resolvers
    ProductMediaResolver,
    //Guards
    ProductMediaAuthGuard,
    //Interceptors
    ProductMediaInterceptor,
    ProductMediaLoggingInterceptor,
  ],
})
export class ProductMediaModule {}

