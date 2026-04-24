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


import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { ProductQueryService } from "../services/productquery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { ProductResponse, ProductsResponse } from "../types/product.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { Product } from "../entities/product.entity";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { OrderBy, valueOfOrderBy } from "src/common/types/common.types";
import { Helper } from "src/common/helpers/helpers";
import { ProductDto } from "../dtos/all-dto";

import { logger } from '@core/logs/logger';
import { SemanticSearchService } from "src/shared/semantic-search/semantic-search.service";


/**
 * Parseo tolerante del query param 'where':
 *  - Si llega como ?where={JSON}, lo parsea a objeto.
 *  - Si llega como query params planos (?isActive=true) descarta claves
 *    reservadas de paginación y devuelve el resto como where plano.
 *  - Nunca devuelve un objeto envuelto en { where: ... } (evita double-wrap).
 */
function parseWhereParam(all: Record<string, any> = {}): Record<string, any> {
  if (!all || typeof all !== "object") return {};
  const raw = (all as any).where;
  if (typeof raw === "string" && raw.trim().startsWith("{")) {
    try { return JSON.parse(raw); } catch { /* fallthrough */ }
  }
  if (raw && typeof raw === "object") return raw as Record<string, any>;
  const reserved = new Set(["where","page","size","sort","order","search","initDate","endDate","options"]);
  const rest: Record<string, any> = {};
  for (const k of Object.keys(all)) if (!reserved.has(k)) rest[k] = (all as any)[k];
  return rest;
}

@ApiTags("Product Query")
@Controller("products/query")
export class ProductQueryController {
  #logger = new Logger(ProductQueryController.name);

  constructor(
    private readonly service: ProductQueryService,
    private readonly semanticSearch: SemanticSearchService,
  ) {}

  @Get("list")
  @ApiOperation({ summary: "Get all product with optional pagination" })
  @ApiResponse({ status: 200, type: ProductsResponse })
  @ApiQuery({ name: "options", required: false, type: ProductDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<Product>    
  ): Promise<ProductsResponse<Product>> {
    try {
     
      const products = await this.service.findAll(options);
      logger.info("Retrieving all product");
      return products;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find product by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter product', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: ProductsResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<ProductsResponse<Product>> {
    try {
      const entities = await this.service.findAndCount(
        { [field]: value },
        paginationArgs
      );

      if (!entities) {
        throw new NotFoundException(
          "Product no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }


  @Get("pagination")
  @ApiOperation({ summary: "Find products with pagination" })
  @ApiResponse({ status: 200, type: ProductsResponse<Product> })
  @ApiQuery({ name: "options", required: false, type: ProductDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<Product>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<ProductsResponse<Product>> {
    try {
     const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades Products no encontradas.");
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all products" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count products with conditions" })
  @ApiResponse({ status: 200, type: ProductsResponse<Product> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async findAndCount(
    @Query() all: Record<string, any> = {},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<ProductsResponse<Product>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findAndCount(
        parseWhereParam(all),
        paginationArgs
      );

      if (!entities) {
        throw new NotFoundException(
          "Entidades Products no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one product with conditions" })
  @ApiResponse({ status: 200, type: ProductResponse<Product> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async findOne(
    @Query() all: Record<string, any> = {}
  ): Promise<ProductResponse<Product>> {
    try {
      const where: Record<string, any> = parseWhereParam(all);
      const entity = await this.service.findOne(where);

      if (!entity) {
        throw new NotFoundException("Entidad Product no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one product or return error" })
  @ApiResponse({ status: 200, type: ProductResponse<Product> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async findOneOrFail(
    @Query() all: Record<string, any> = {}
  ): Promise<ProductResponse<Product> | Error> {
    try {
      const where: Record<string, any> = parseWhereParam(all);
      const entity = await this.service.findOne(where);

      if (!entity) {
        return new NotFoundException("Entidad Product no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  /**
   * Búsqueda semántica / textual sobre products.
   *
   * Ejemplo: `/products/query/semantic-search?q=Lapiz%20Labial` devolverá
   * productos como `Pinta labios` o `Kit de maquillaje` si su embedding es
   * cercano al del texto buscado.
   *
   * IMPORTANTE: declarado ANTES de `@Get(":id")` para evitar que `:id` capture
   * el segmento `semantic-search`.
   */
  @Get("semantic-search")
  @ApiOperation({ summary: "Semantic (pgvector) or textual search over products" })
  @ApiQuery({ name: "q", required: true, type: String, description: "Texto de búsqueda" })
  @ApiQuery({ name: "semanticSearch", required: false, type: Boolean, description: "Default true. Si false usa búsqueda textual." })
  @ApiQuery({ name: "similarityThreshold", required: false, type: Number, description: "Default 0.7" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async semanticSearchEndpoint(
    @Query("q") q: string,
    @Query("semanticSearch") semanticSearch?: string,
    @Query("similarityThreshold") similarityThreshold?: string,
    @Query("limit") limit?: string,
  ): Promise<{ ok: boolean; data: Product[]; totalCount: number; searchMode: string; similarityThreshold: number; scores?: number[] }> {
    try {
      const semanticEnabled = semanticSearch === undefined ? true : String(semanticSearch).toLowerCase() !== 'false';
      const threshold = similarityThreshold !== undefined && !Number.isNaN(Number(similarityThreshold)) ? Number(similarityThreshold) : 0.7;
      const lim = limit !== undefined && !Number.isNaN(Number(limit)) ? Number(limit) : 25;
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        1, Math.max(lim * 4, 200), "createdAt", valueOfOrderBy(OrderBy.asc), "", undefined, undefined,
      );
      const pageResp = await this.service.findWithPagination({} as any, paginationArgs) as any;
      const items: Product[] = Array.isArray(pageResp?.data) ? pageResp.data : (Array.isArray(pageResp?.items) ? pageResp.items : []);
      const result = await this.semanticSearch.findSimilar(items, q || "", {
        semanticSearch: semanticEnabled,
        similarityThreshold: threshold,
        limit: lim,
      });
      return {
        ok: true,
        data: result.items,
        totalCount: result.totalCount,
        searchMode: result.searchMode,
        similarityThreshold: result.similarityThreshold,
        scores: result.scores,
      };
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({ status: 200, type: ProductResponse<Product> })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the product to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(ProductQueryService.name)
      .get(ProductQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<ProductResponse<Product>> {
    try {
      const product = await this.service.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(
          "Product no encontrado para el id solicitado"
        );
      }
      return product;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}


