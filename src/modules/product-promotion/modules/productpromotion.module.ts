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
import { ProductPromotionCommandController } from "../controllers/productpromotioncommand.controller";
import { ProductPromotionQueryController } from "../controllers/productpromotionquery.controller";
import { ProductPromotionCommandService } from "../services/productpromotioncommand.service";
import { ProductPromotionQueryService } from "../services/productpromotionquery.service";
import { ProductPromotionCommandRepository } from "../repositories/productpromotioncommand.repository";
import { ProductPromotionQueryRepository } from "../repositories/productpromotionquery.repository";
import { ProductPromotionRepository } from "../repositories/productpromotion.repository";
import { ProductPromotionResolver } from "../graphql/productpromotion.resolver";
import { ProductPromotionAuthGuard } from "../guards/productpromotionauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductPromotion } from "../entities/product-promotion.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductPromotionHandler } from "../commands/handlers/createproductpromotion.handler";
import { UpdateProductPromotionHandler } from "../commands/handlers/updateproductpromotion.handler";
import { DeleteProductPromotionHandler } from "../commands/handlers/deleteproductpromotion.handler";
import { GetProductPromotionByIdHandler } from "../queries/handlers/getproductpromotionbyid.handler";
import { GetProductPromotionByFieldHandler } from "../queries/handlers/getproductpromotionbyfield.handler";
import { GetAllProductPromotionHandler } from "../queries/handlers/getallproductpromotion.handler";
import { ProductPromotionCrudSaga } from "../sagas/productpromotion-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductPromotionInterceptor } from "../interceptors/productpromotion.interceptor";
import { ProductPromotionLoggingInterceptor } from "../interceptors/productpromotion.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductPromotion]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductPromotionCommandController, ProductPromotionQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductPromotionQueryService,
    ProductPromotionCommandService,
    //Repositories
    ProductPromotionCommandRepository,
    ProductPromotionQueryRepository,
    ProductPromotionRepository,      
    //Resolvers
    ProductPromotionResolver,
    //Guards
    ProductPromotionAuthGuard,
    //Interceptors
    ProductPromotionInterceptor,
    ProductPromotionLoggingInterceptor,
    //CQRS Handlers
    CreateProductPromotionHandler,
    UpdateProductPromotionHandler,
    DeleteProductPromotionHandler,
    GetProductPromotionByIdHandler,
    GetProductPromotionByFieldHandler,
    GetAllProductPromotionHandler,
    ProductPromotionCrudSaga,
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
    ProductPromotionQueryService,
    ProductPromotionCommandService,
    //Repositories
    ProductPromotionCommandRepository,
    ProductPromotionQueryRepository,
    ProductPromotionRepository,      
    //Resolvers
    ProductPromotionResolver,
    //Guards
    ProductPromotionAuthGuard,
    //Interceptors
    ProductPromotionInterceptor,
    ProductPromotionLoggingInterceptor,
  ],
})
export class ProductPromotionModule {}

