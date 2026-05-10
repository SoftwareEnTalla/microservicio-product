import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type ProductCommerceRow = {
  id: string;
  name: string;
  productId?: string | null;
  status?: string | null;
  amount?: number;
  currency?: string | null;
  stockMetric?: number;
  promoMetric?: number;
  highlight?: string | null;
  modificationDate?: string | null;
  creationDate?: string | null;
};

@Injectable()
export class ProductCommerceSummaryService {
  constructor(@Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined) {}

  async getOverview(limit: number = 6): Promise<Record<string, unknown>> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return {
        ok: true,
        message: 'Resumen comercial de Product obtenido con éxito.',
        data: {
          totals: {
            totalProducts: 0,
            activeProducts: 0,
            pricedProducts: 0,
            inventoryTrackedProducts: 0,
            lowStockProducts: 0,
            primaryMediaProducts: 0,
            activePromotions: 0,
            promotionalProducts: 0,
            publicationReadinessPercent: 0,
          },
          latestPrices: [],
          latestInventory: [],
          latestMedia: [],
          latestPromotions: [],
        },
      };
    }

    const safeLimit = Math.max(1, Math.min(limit, 12));
    const [totals] = await dataSource.query(
      `SELECT
         (SELECT COUNT(*)::int FROM product_base_entity WHERE COALESCE("isActive", true) = true AND type = 'product') AS "totalProducts",
         (SELECT COUNT(*)::int FROM product_base_entity WHERE COALESCE("isActive", true) = true AND type = 'product' AND UPPER(COALESCE(status, '')) = 'ACTIVE') AS "activeProducts",
         (SELECT COUNT(DISTINCT "productId")::int FROM product_price_base_entity WHERE COALESCE("isActive", true) = true AND type = 'productprice') AS "pricedProducts",
         (SELECT COUNT(DISTINCT "productId")::int FROM product_inventory_base_entity WHERE COALESCE("isActive", true) = true AND type = 'productinventory') AS "inventoryTrackedProducts",
         (SELECT COUNT(DISTINCT "productId")::int FROM product_inventory_base_entity WHERE COALESCE("isActive", true) = true AND type = 'productinventory' AND COALESCE("availableStock", 0) <= COALESCE("reorderPoint", 0)) AS "lowStockProducts",
         (SELECT COUNT(DISTINCT "productId")::int FROM product_media_base_entity WHERE COALESCE("isActive", true) = true AND type = 'productmedia' AND COALESCE("isPrimary", false) = true) AS "primaryMediaProducts",
         (SELECT COUNT(*)::int FROM product_promotion_base_entity WHERE COALESCE("isActive", true) = true AND type = 'productpromotion' AND UPPER(COALESCE(status, '')) = 'ACTIVE') AS "activePromotions",
         (SELECT COUNT(DISTINCT "productId")::int FROM product_promotion_base_entity WHERE COALESCE("isActive", true) = true AND type = 'productpromotion') AS "promotionalProducts"`,
    );

    const latestPrices = await dataSource.query(
      `SELECT id, name, "productId", status, COALESCE(amount, 0)::float AS amount, currency,
              "priceType" AS highlight, "modificationDate", "creationDate"
       FROM product_price_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'productprice'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const latestInventory = await dataSource.query(
      `SELECT id, name, "productId", "stockStatus" AS status,
              COALESCE("availableStock", 0)::float AS "stockMetric",
              COALESCE("reservedStock", 0)::float AS "promoMetric",
              "warehouseId" AS highlight, "modificationDate", "creationDate"
       FROM product_inventory_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'productinventory'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const latestMedia = await dataSource.query(
      `SELECT id, name, "productId", status,
              COALESCE(position, 0)::float AS "stockMetric",
              CASE WHEN COALESCE("isPrimary", false) = true THEN 1 ELSE 0 END::float AS "promoMetric",
              "mediaType" AS highlight, "modificationDate", "creationDate"
       FROM product_media_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'productmedia'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const latestPromotions = await dataSource.query(
      `SELECT id, name, "productId", status,
              COALESCE("specialPrice", 0)::float AS amount,
              NULL::varchar AS currency,
              COALESCE("discountPercent", 0)::float AS "promoMetric",
              "promotionType" AS highlight, "modificationDate", "creationDate"
       FROM product_promotion_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'productpromotion'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const totalProducts = Number(totals?.totalProducts ?? 0);
    const readinessBase = Math.min(
      Number(totals?.pricedProducts ?? 0),
      Number(totals?.inventoryTrackedProducts ?? 0),
      Number(totals?.primaryMediaProducts ?? 0),
    );

    return {
      ok: true,
      message: 'Resumen comercial de Product obtenido con éxito.',
      data: {
        totals: {
          totalProducts,
          activeProducts: Number(totals?.activeProducts ?? 0),
          pricedProducts: Number(totals?.pricedProducts ?? 0),
          inventoryTrackedProducts: Number(totals?.inventoryTrackedProducts ?? 0),
          lowStockProducts: Number(totals?.lowStockProducts ?? 0),
          primaryMediaProducts: Number(totals?.primaryMediaProducts ?? 0),
          activePromotions: Number(totals?.activePromotions ?? 0),
          promotionalProducts: Number(totals?.promotionalProducts ?? 0),
          publicationReadinessPercent: totalProducts > 0 ? Math.round((readinessBase / totalProducts) * 100) : 0,
        },
        latestPrices: latestPrices as ProductCommerceRow[],
        latestInventory: latestInventory as ProductCommerceRow[],
        latestMedia: latestMedia as ProductCommerceRow[],
        latestPromotions: latestPromotions as ProductCommerceRow[],
      },
    };
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }
    return null;
  }
}