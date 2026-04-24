# Product Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3006
> **Base URL**: `http://localhost:3006/api`
> **Swagger UI**: `http://localhost:3006/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: Product

El microservicio **product** modela el catálogo de productos: `Product` (aggregate root) con sus variantes, precios, inventario, medios, atributos, promociones, especificaciones y relaciones entre productos.

### Historias de Usuario

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Producto con ciclo de vida (DRAFT → ACTIVE) | product |
| UH-2 | Variantes (SKU/combinaciones) | product-variant |
| UH-3 | Precios multi-moneda y vigencias | product-price |
| UH-4 | Inventario por ubicación | product-inventory |
| UH-5 | Medios (imágenes, video) | product-media |
| UH-6 | Atributos dinámicos | product-attribute |
| UH-7 | Promociones | product-promotion |
| UH-8 | Especificaciones técnicas | product-specification |
| UH-9 | Relaciones (cross-sell, up-sell, bundle) | product-relationship |
| UH-10 | Trazabilidad sync catalog | catalog-sync-log |
| UH-11 | Integración catalog-service | catalog-client |

---

## 2. Modelo DSL

Los modelos están en `models/product/`.

| Modelo XML | Versión | AggregateRoot | ModuleType |
|------------|---------|:---:|---|
| `product.xml` | 1.0.0 | ✓ | aggregate-root |
| `product-variant.xml` | 1.0.0 | ✗ | entity |
| `product-price.xml` | 1.0.0 | ✗ | entity |
| `product-inventory.xml` | 1.0.0 | ✗ | entity |
| `product-media.xml` | 1.0.0 | ✗ | entity |
| `product-attribute.xml` | 1.0.0 | ✗ | entity |
| `product-promotion.xml` | 1.0.0 | ✗ | entity |
| `product-specification.xml` | 1.0.0 | ✗ | entity |
| `product-relationship.xml` | 1.0.0 | ✗ | entity |
| `catalog-sync-log.xml` | 1.0.0 | ✗ | entity |

### Estructura de un modelo DSL

```xml
<domain-model name="product" schemaVersion="2.0" version="1.0.0"
              boundedContext="product" aggregateRoot="true" moduleType="aggregate-root">
  <fields>
    <field name="sku" type="string" unique="true"/>
    <field name="name" type="string"/>
    <field name="brand" type="string"/>
    <field name="category" type="string"/>
    <field name="status" type="string" defaultValue="DRAFT"/>
    <field name="currency" type="string"/>
    <field name="basePrice" type="decimal" precision="12" scale="2"/>
  </fields>
</domain-model>
```

---

## 3. Arquitectura

### 3.1 Patrones

| Patrón | Descripción |
|--------|-------------|
| **CQRS** | Command/query separados. |
| **Event Sourcing** | Eventos + EventStore + Kafka. |
| **Event-Driven** | `ProductActivatedEvent` desencadena proyecciones en otros BCs. |
| **Saga Pattern** | Saga CRUD por módulo. |
| **DDD** | Aggregate *Product* + entidades auxiliares. |

### 3.2 Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│              PRODUCT MICROSERVICE  (3006)                  │
├────────────────────────────────────────────────────────────┤
│  REST Command / REST Query / GraphQL                       │
│                                                            │
│   CommandBus / QueryBus / Resolvers                        │
│   Service ↔ Repository → PostgreSQL (product-service)      │
│  KafkaEventPublisher ─ EventStore ─ KafkaEventSubscriber   │
│                   CatalogClient (breaker + cache)          │
└────────────────────────────────────────────────────────────┘
```

### 3.3 Estructura de carpetas por módulo

```
src/modules/<module>/
├── commands/ controllers/ decorators/ dtos/ entities/
├── events/ graphql/ guards/ interceptors/ modules/
├── queries/ repositories/ sagas/ services/ shared/ types/
```

---

## 4. Módulos del Microservicio

| Módulo | Entidad | Campos clave |
|--------|---------|--------------|
| product | `Product` | sku, name, brand, category, status, currency, basePrice |
| product-variant | `ProductVariant` | productId, sku, name, options (JSON), status |
| product-price | `ProductPrice` | productId, variantId, currency, priceType, amount, validFrom/To |
| product-inventory | `ProductInventory` | productId, variantId, locationCode, available, reserved |
| product-media | `ProductMedia` | productId, url, mimeType, sortOrder, role |
| product-attribute | `ProductAttribute` | productId, code, displayName, valueType, value |
| product-promotion | `ProductPromotion` | productId, code, kind, percent/amount, validFrom/To |
| product-specification | `ProductSpecification` | productId, code, value, unit, group |
| product-relationship | `ProductRelationship` | sourceProductId, targetProductId, kind (CROSS_SELL/UPSELL/BUNDLE) |
| catalog-sync-log | `CatalogSyncLog` | categoryCode, triggeredBy, outcome |

---

## 5. Eventos Publicados

Por cada módulo se generan 3 eventos CRUD. Adicionalmente:

| Módulo | Evento extra | Tópico Kafka | Replayable |
|--------|--------------|--------------|:---:|
| product | `ProductActivatedEvent` | `product.product-activated` | ✓ |
| product (saga) | `ProductCrudSagaFailedEvent` | `product.product-crud-saga-failed` | ✗ |
| product-variant (saga) | `ProductVariantCrudSagaFailedEvent` | `product.variant-crud-saga-failed` | ✗ |
| product-price (saga) | `ProductPriceCrudSagaFailedEvent` | `product.price-crud-saga-failed` | ✗ |
| product-inventory (saga) | `ProductInventoryCrudSagaFailedEvent` | `product.inventory-crud-saga-failed` | ✗ |
| product-media (saga) | `ProductMediaCrudSagaFailedEvent` | `product.media-crud-saga-failed` | ✗ |
| product-attribute (saga) | `ProductAttributeCrudSagaFailedEvent` | `product.attribute-crud-saga-failed` | ✗ |
| product-promotion (saga) | `ProductPromotionCrudSagaFailedEvent` | `product.promotion-crud-saga-failed` | ✗ |
| product-specification (saga) | `ProductSpecificationCrudSagaFailedEvent` | `product.specification-crud-saga-failed` | ✗ |
| product-relationship (saga) | `ProductRelationshipCrudSagaFailedEvent` | `product.relationship-crud-saga-failed` | ✗ |

Tópicos CRUD: `product.<entidad>-created|updated|deleted` (v1.0.0, replayable).

### Estructura de un evento publicado

```json
{
  "aggregateId": "uuid",
  "timestamp": "2026-04-21T10:00:00.000Z",
  "payload": {
    "instance": { /* entidad */ },
    "metadata": {
      "initiatedBy":"user-id","correlationId":"uuid",
      "eventName":"ProductCreatedEvent","eventVersion":"1.0.0",
      "sourceService":"product-service","retryCount":0,
      "idempotencyKey":"uuid"
    }
  }
}
```

---

## 6. Eventos Consumidos

| Módulo | Evento | Origen | Acción |
|--------|--------|--------|--------|
| catalog-client | `catalog.catalog-item-upserted` | catalog-service | Invalida caché + syncCategory |
| catalog-client | `catalog.catalog-item-deprecated` | catalog-service | Invalida caché + syncCategory |

`KAFKA_TRUSTED_PRODUCERS` filtra productores confiables; `EventIdempotencyService` deduplica.

---

## 7. API REST — Guía Completa Swagger

### 7.1 Command CRUD

| Método | Ruta | Body |
|--------|------|------|
| POST | `/api/<entities>/command` | `CreateXxxDto` |
| POST | `/api/<entities>/command/bulk` | `CreateXxxDto[]` |
| PUT | `/api/<entities>/command/:id` | `UpdateXxxDto` |
| PUT | `/api/<entities>/command/bulk` | `UpdateXxxDto[]` |
| DELETE | `/api/<entities>/command/:id` | — |
| DELETE | `/api/<entities>/command/bulk` | — |

### 7.2 Query CRUD

Mismo set que demás microservicios (list, :id, field/:field, pagination, count, search, find-one, find-one-or-fail).

### 7.3 Prefijos por módulo

| Módulo | Command | Query |
|--------|---------|-------|
| product | `/api/products/command` | `/api/products/query` |
| product-variant | `/api/productvariants/command` | `/api/productvariants/query` |
| product-price | `/api/productprices/command` | `/api/productprices/query` |
| product-inventory | `/api/productinventorys/command` | `/api/productinventorys/query` |
| product-media | `/api/productmedias/command` | `/api/productmedias/query` |
| product-attribute | `/api/productattributes/command` | `/api/productattributes/query` |
| product-promotion | `/api/productpromotions/command` | `/api/productpromotions/query` |
| product-specification | `/api/productspecifications/command` | `/api/productspecifications/query` |
| product-relationship | `/api/productrelationships/command` | `/api/productrelationships/query` |
| catalog-sync-log | `/api/catalogsynclogs/command` | `/api/catalogsynclogs/query` |
| catalog-client | `/api/catalog-sync` | — |

### 7.4 DTOs principales

```json
// CreateProductDto
{ "sku":"SKU-1","name":"Camiseta","brand":"Acme","category":"CLOTHING",
  "status":"DRAFT","currency":"MXN","basePrice":199.99 }

// CreateProductVariantDto
{ "productId":"UUID","sku":"SKU-1-RED-M","options":{"color":"RED","size":"M"},
  "status":"ACTIVE" }
```

---

## 8. Guía para Desarrolladores

Mismo patrón canónico: dual publish + registro en `event-registry.ts` + saga `@Saga()` con `ofType`.

---

## 8.5 Búsqueda semántica (pgvector + IA)

El campo `semanticEmbedding` (tipo `vector`, 1536 dim., OpenAI text-embedding-3-small compatible) se calcula automáticamente al **crear/actualizar** un producto a partir de `name + code + slug + shortDescription + longDescription + description + keywords + tags + metadata`. `semanticEmbeddingUpdatedAt` guarda el timestamp del último cálculo. Al actualizar el embedding se publica el evento de dominio `ProductEmbeddingUpdated` (topic `product-embedding-updated`).

### Ejemplo de uso (caso del DSL)

Un usuario busca `"Lapiz Labial"` y espera recibir productos semánticamente cercanos como `"Pinta labios"` o `"Kit de maquillaje"`, aunque sus nombres no compartan tokens exactos.

### Endpoint

`GET /products/query/semantic-search?q=Lapiz%20Labial&semanticSearch=true&similarityThreshold=0.7&limit=25`

| Query param | Tipo | Default | Descripción |
|-------------|------|---------|-------------|
| `q` | string | — (requerido) | Texto a buscar |
| `semanticSearch` | boolean | `true` | Si `false` se fuerza búsqueda textual |
| `similarityThreshold` | number | `0.7` | Umbral de similitud coseno (0..1) |
| `limit` | number | `25` | Máximo de resultados |

La respuesta incluye `searchMode`: `SEMANTIC`, `TEXTUAL`, `TEXTUAL_FALLBACK`. En modo `SEMANTIC` devuelve además el array `scores`.

### Implementación técnica

- Columna física: `text` con transformer JSON en TypeORM. Migración posterior puede promover a `VECTOR(1536)` real cuando pgvector esté activo en la DB.
- Servicio: `SemanticSearchService` en `src/shared/semantic-search/`. Embedding por defecto determinista basado en hashing — apto para e2e. Reemplazar `computeEmbedding` por integración real (OpenAI `text-embedding-3-small`, sentence-transformers local, etc.) en producción.
- Infraestructura: imagen `imresamu/postgis-pgvector:16-3.4` y `CREATE EXTENSION IF NOT EXISTS vector;` en `data-center/postgres/initdb/01-extensions.sql`.

## 9. Test E2E con curl

```bash
cd product-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash product-service/src/docs/e2e-test.sh
```

| Paso | Descripción | Cobertura |
|------|-------------|-----------|
| 0 | Pre-flight health | Infra |
| 1 | Crear product DRAFT → `product.product-created` | `product` |
| 2 | Update → ACTIVE → `product-updated` + `product-activated` | Kafka produce |
| 3 | Crear variant → `variant-created` | `product-variant` |
| 4 | Crear price | `product-price` |
| 5 | Crear inventory | `product-inventory` |
| 6 | Crear media | `product-media` |
| 7 | Crear attribute | `product-attribute` |
| 8 | Crear promotion | `product-promotion` |
| 9 | Crear specification | `product-specification` |
| 10 | Crear relationship | `product-relationship` |
| 11 | Delete producto (caso feliz bulk) | Todos CRUD |
| 12 | Catalog-sync health + status + run | `catalog-client` |
| 13 | `kcat -L` verifica topics `product.*` | Kafka probe |
| 14 | Limpieza | Todos |

---

## 10. Análisis de Sagas y Eventos (E2E)

### 10.1 Inventario de sagas

Una saga CRUD por cada uno de los 9 módulos de dominio + `CatalogSyncLogCrudSaga` = **10 sagas CRUD**.

### 10.2 Totales

- **Eventos registrados**: 30 CRUD (9×3) + 1 ProductActivated + 10 saga-failed + 3 catalog-sync-log = ≈44.
- **Topics Kafka**: main + retry + DLQ por cada evento.

### 10.3 Dual publish

Obligatorio para activar sagas `@Saga()` in-process.

---

## 11. Variables de Entorno

| Variable | Uso |
|----------|-----|
| `APP_NAME` / `STAGE` / `PORT` | 3006 |
| `DB_HOST/PORT/USERNAME/PASSWORD/NAME` | PostgreSQL (product-service) |
| `JWT_SECRET` / `API_KEY` / `SA_EMAIL` / `SA_PWD` | Auth |
| `KAFKA_ENABLED` / `KAFKA_BROKERS` / `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | Kafka |
| `EVENT_SOURCING_ENABLED` / `EVENT_STORE_ENABLED` | Event sourcing |
| `REDIS_HOST/PORT/TTL` | Redis cache |
| `CATALOG_BASE_URL` / `CATALOG_SYNC_INTERVAL_MS` | CatalogClient |
| `CATALOG_BREAKER_ERROR_THRESHOLD` / `CATALOG_BREAKER_RESET_MS` | Breaker |
| `SWAGGER_USER` / `SWAGGER_PWD` | Swagger basic auth |
| `LOG_API_BASE_URL` / `LOG_KAFKA_TOPIC` / `LOG_EXECUTION_TIME` | Codetrace |

---

## 12. Build & Run

```bash
cd product-service
npm install && npm run build
node dist/main.js
# o docker-compose up product-service
```

---

## 13. Integración con catalog-service

Documentación canónica de `CatalogClientModule`: [docs/README-catalog-integration.md](../../../docs/README-catalog-integration.md).
