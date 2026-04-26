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


import { DynamicModule, Module, OnModuleInit, Optional, Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ProductCommandController } from "./modules/product/controllers/productcommand.controller";
import { ProductModule } from "./modules/product/modules/product.module";
import { CqrsModule } from "@nestjs/cqrs";
import { AppDataSource, initializeDatabase } from "./data-source";
import { ProductQueryController } from "./modules/product/controllers/productquery.controller";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import GraphQLJSON from "graphql-type-json";
import { ProductCommandService } from "./modules/product/services/productcommand.service";
import { ProductQueryService } from "./modules/product/services/productquery.service";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggingModule } from "./modules/product/modules/logger.module";
import { ModuleRef } from "@nestjs/core";
import { ServiceRegistry } from "@core/service-registry";
import LoggerService, { logger } from "@core/logs/logger";
import { CatalogSyncLogModule } from "./modules/catalog-sync-log/modules/catalogsynclog.module";
import { CatalogSyncLogCommandService } from "./modules/catalog-sync-log/services/catalogsynclogcommand.service";
import { CatalogSyncLogQueryService } from "./modules/catalog-sync-log/services/catalogsynclogquery.service";
import { ProductAttributeModule } from "./modules/product-attribute/modules/productattribute.module";
import { ProductAttributeCommandService } from "./modules/product-attribute/services/productattributecommand.service";
import { ProductAttributeQueryService } from "./modules/product-attribute/services/productattributequery.service";
import { ProductInventoryModule } from "./modules/product-inventory/modules/productinventory.module";
import { ProductInventoryCommandService } from "./modules/product-inventory/services/productinventorycommand.service";
import { ProductInventoryQueryService } from "./modules/product-inventory/services/productinventoryquery.service";
import { ProductMediaModule } from "./modules/product-media/modules/productmedia.module";
import { ProductMediaCommandService } from "./modules/product-media/services/productmediacommand.service";
import { ProductMediaQueryService } from "./modules/product-media/services/productmediaquery.service";
import { ProductPriceModule } from "./modules/product-price/modules/productprice.module";
import { ProductPriceCommandService } from "./modules/product-price/services/productpricecommand.service";
import { ProductPriceQueryService } from "./modules/product-price/services/productpricequery.service";
import { ProductPromotionModule } from "./modules/product-promotion/modules/productpromotion.module";
import { ProductPromotionCommandService } from "./modules/product-promotion/services/productpromotioncommand.service";
import { ProductPromotionQueryService } from "./modules/product-promotion/services/productpromotionquery.service";
import { ProductRelationshipModule } from "./modules/product-relationship/modules/productrelationship.module";
import { ProductRelationshipCommandService } from "./modules/product-relationship/services/productrelationshipcommand.service";
import { ProductRelationshipQueryService } from "./modules/product-relationship/services/productrelationshipquery.service";
import { ProductSpecificationModule } from "./modules/product-specification/modules/productspecification.module";
import { ProductSpecificationCommandService } from "./modules/product-specification/services/productspecificationcommand.service";
import { ProductSpecificationQueryService } from "./modules/product-specification/services/productspecificationquery.service";
import { ProductVariantModule } from "./modules/product-variant/modules/productvariant.module";
import { ProductVariantCommandService } from "./modules/product-variant/services/productvariantcommand.service";
import { ProductVariantQueryService } from "./modules/product-variant/services/productvariantquery.service";

import { CatalogClientModule } from "./modules/catalog-client/catalog-client.module";

/*
//TODO unused for while dependencies
import { I18nModule } from "nestjs-i18n";
import { join } from "path";
import { CustomI18nLoader } from "./core/loaders/custom-I18n-Loader";
import { TranslocoService } from "@jsverse/transloco";
import { HeaderResolver, AcceptLanguageResolver } from "nestjs-i18n";
import { TranslocoWrapperService } from "./core/services/transloco-wrapper.service";
import { TranslocoModule } from "@ngneat/transloco";
import LoggerService, { logger } from "@core/logs/logger";

*/

import { HorizontalModule } from "@common/horizontal";

import { NomencladorListenersModule } from './modules/nomenclador-listeners/nomenclador-listeners.module';
import { AppliesToModule } from "./modules/applies-to/modules/appliesto.module";
import { MediaTypeModule } from "./modules/media-type/modules/mediatype.module";
import { PriceTypeModule } from "./modules/price-type/modules/pricetype.module";
import { ProductStatusModule } from "./modules/product-status/modules/productstatus.module";
import { ProductVisibilityModule } from "./modules/product-visibility/modules/productvisibility.module";
import { PromotionTypeModule } from "./modules/promotion-type/modules/promotiontype.module";
import { RelationshipTypeModule } from "./modules/relationship-type/modules/relationshiptype.module";
import { StockStatusModule } from "./modules/stock-status/modules/stockstatus.module";
import { TargetEntityTypeModule } from "./modules/target-entity-type/modules/targetentitytype.module";
@Module({
  imports: [
    // Se importa/registra el módulo de caché
    CacheModule.register(),

    /**
     * ConfigModule - Configuración global de variables de entorno
     *
     * Configuración centralizada para el manejo de variables de entorno.
     * Se establece como global para estar disponible en toda la aplicación.
     */
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en todos los módulos sin necesidad de importar
      envFilePath: ".env", // Ubicación del archivo .env
      cache: true, // Mejora rendimiento cacheando las variables
      expandVariables: true, // Permite usar variables anidadas (ej: )
    }),

    /**
     * TypeOrmModule - Configuración de la base de datos
     *
     * Conexión asíncrona con PostgreSQL y configuración avanzada.
     * Se inicializa primero la conexión a la base de datos.
     */
    // TypeORM solo si INCLUDING_DATA_BASE_SYSTEM=true
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async () => {
              const dataSource = await initializeDatabase();
              return {
                ...dataSource.options,
                autoLoadEntities: true,
                retryAttempts: 5,
                retryDelay: 3000,
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.DB_LOGGING === "true",
              };
            },
          }),
        ]
      : []),

    /**
     * Módulos Product de la aplicación
     */
    CqrsModule,
    HorizontalModule,
    ProductModule,
        CatalogSyncLogModule,
    ProductAttributeModule,
    ProductInventoryModule,
    ProductMediaModule,
    ProductPriceModule,
    ProductPromotionModule,
    ProductRelationshipModule,
    ProductSpecificationModule,
    ProductVariantModule,    
    /**
     * Módulo Logger de la aplicación
     */
    CatalogClientModule,
    LoggingModule,

    // GraphQL solo si GRAPHQL_ENABLED=true
    ...(process.env.GRAPHQL_ENABLED === 'true'
      ? [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            buildSchemaOptions: {
              dateScalarMode: "timestamp",
            },
            resolvers: { JSON: GraphQLJSON },
          }),
        ]
      : []),
  
    NomencladorListenersModule,
      AppliesToModule,
    MediaTypeModule,
    PriceTypeModule,
    ProductStatusModule,
    ProductVisibilityModule,
    PromotionTypeModule,
    RelationshipTypeModule,
    StockStatusModule,
    TargetEntityTypeModule,
  ],

  /**
   * Controladores de Product
   *
   * Registro de controladores a nivel de aplicación.
   */
  controllers: [
  //No se recomienda habilitar los controladores si ya fueron declarados en el módulo: ProductModule
  /*
  
  ProductCommandController, 
  ProductQueryController
  
  */
  ],

  /**
   * Proveedores (Servicios, Repositorios, etc.) de Product
   *
   * Registro de servicios globales y configuración de inyección de dependencias.
   */
  providers: [
    // Configuración de Base de datos
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          {
            provide: DataSource,
            useValue: AppDataSource,
          },
        ]
      : []),
    // Se importan los servicios del módulo
    ProductCommandService,
    ProductQueryService,
    LoggerService
  ],

  /**
   * Exportaciones de módulos y servicios
   *
   * Hace disponibles módulos y servicios para otros módulos que importen este módulo.
   */
  exports: [ProductCommandService, ProductQueryService,LoggerService],
})
export class ProductAppModule implements OnModuleInit {
  /**
   * Constructor del módulo principal
   * @param dataSource Instancia inyectada del DataSource
   * @param translocoService Servicio para manejo de idiomas
   */
  constructor(
    private moduleRef: ModuleRef,
    @Optional() @Inject(DataSource) private readonly dataSource?: DataSource
  ) {
    if (process.env.INCLUDING_DATA_BASE_SYSTEM === 'true') {
      this.checkDatabaseConnection();
    }
    this.setupLanguageChangeHandling();
    this.onModuleInit();
  }
  onModuleInit() {
    //Inicializar servicios del microservicio
    ServiceRegistry.getInstance().setModuleRef(this.moduleRef);
    ServiceRegistry.getInstance().registryAll([
      ProductCommandService,
      ProductQueryService,
      CatalogSyncLogCommandService,
      CatalogSyncLogQueryService,
      ProductAttributeCommandService,
      ProductAttributeQueryService,
      ProductInventoryCommandService,
      ProductInventoryQueryService,
      ProductMediaCommandService,
      ProductMediaQueryService,
      ProductPriceCommandService,
      ProductPriceQueryService,
      ProductPromotionCommandService,
      ProductPromotionQueryService,
      ProductRelationshipCommandService,
      ProductRelationshipQueryService,
      ProductSpecificationCommandService,
      ProductSpecificationQueryService,
      ProductVariantCommandService,
      ProductVariantQueryService,    
    ]);
    const loggerService = ServiceRegistry.getInstance().get(
      "LoggerService"
    ) as LoggerService;
    if (loggerService) 
    loggerService.log(ServiceRegistry.getInstance());
  }
  /**
   * Verifica la conexión a la base de datos al iniciar
   *
   * Realiza una consulta simple para confirmar que la conexión está activa.
   * Termina la aplicación si no puede establecer conexión.
   */
  private async checkDatabaseConnection() {
    try {
      if (!this.dataSource) return;
      await this.dataSource.query("SELECT 1");
      logger.log("✅ Conexión a la base de datos verificada correctamente");
    } catch (error) {
      logger.error(
        "❌ Error crítico: No se pudo conectar a la base de datos",
        error
      );
      process.exit(1); // Termina la aplicación con código de error
    }
  }

  /**
   * Configura el manejo de cambios de idioma
   *
   * Suscribe a eventos de cambio de idioma para mantener consistencia.
   */
  private setupLanguageChangeHandling() {}
}


