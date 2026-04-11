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
import { ProductInventoryCommandController } from "../controllers/productinventorycommand.controller";
import { ProductInventoryQueryController } from "../controllers/productinventoryquery.controller";
import { ProductInventoryCommandService } from "../services/productinventorycommand.service";
import { ProductInventoryQueryService } from "../services/productinventoryquery.service";
import { ProductInventoryCommandRepository } from "../repositories/productinventorycommand.repository";
import { ProductInventoryQueryRepository } from "../repositories/productinventoryquery.repository";
import { ProductInventoryRepository } from "../repositories/productinventory.repository";
import { ProductInventoryResolver } from "../graphql/productinventory.resolver";
import { ProductInventoryAuthGuard } from "../guards/productinventoryauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductInventory } from "../entities/product-inventory.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProductInventoryHandler } from "../commands/handlers/createproductinventory.handler";
import { UpdateProductInventoryHandler } from "../commands/handlers/updateproductinventory.handler";
import { DeleteProductInventoryHandler } from "../commands/handlers/deleteproductinventory.handler";
import { GetProductInventoryByIdHandler } from "../queries/handlers/getproductinventorybyid.handler";
import { GetProductInventoryByFieldHandler } from "../queries/handlers/getproductinventorybyfield.handler";
import { GetAllProductInventoryHandler } from "../queries/handlers/getallproductinventory.handler";
import { ProductInventoryCrudSaga } from "../sagas/productinventory-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProductInventoryInterceptor } from "../interceptors/productinventory.interceptor";
import { ProductInventoryLoggingInterceptor } from "../interceptors/productinventory.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ProductInventory]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [ProductInventoryCommandController, ProductInventoryQueryController],
  providers: [
    //Services
    EventStoreService,
    ProductInventoryQueryService,
    ProductInventoryCommandService,
    //Repositories
    ProductInventoryCommandRepository,
    ProductInventoryQueryRepository,
    ProductInventoryRepository,      
    //Resolvers
    ProductInventoryResolver,
    //Guards
    ProductInventoryAuthGuard,
    //Interceptors
    ProductInventoryInterceptor,
    ProductInventoryLoggingInterceptor,
    //CQRS Handlers
    CreateProductInventoryHandler,
    UpdateProductInventoryHandler,
    DeleteProductInventoryHandler,
    GetProductInventoryByIdHandler,
    GetProductInventoryByFieldHandler,
    GetAllProductInventoryHandler,
    ProductInventoryCrudSaga,
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
    ProductInventoryQueryService,
    ProductInventoryCommandService,
    //Repositories
    ProductInventoryCommandRepository,
    ProductInventoryQueryRepository,
    ProductInventoryRepository,      
    //Resolvers
    ProductInventoryResolver,
    //Guards
    ProductInventoryAuthGuard,
    //Interceptors
    ProductInventoryInterceptor,
    ProductInventoryLoggingInterceptor,
  ],
})
export class ProductInventoryModule {}

