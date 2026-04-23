#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — product-service (puerto 3006)
# Módulos: products, productvariants, productattributes, productprices, productinventorys,
#          productmedias, productspecifications, productrelationships, productpromotions,
#          catalogsynclogs, catalog-client
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3006/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — Product Microservice — 100% UH + Swagger         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/products/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 Product"
P=$(cat <<EOF
{"name":"E2E Product ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PRD-${UNIQUE}","sku":"SKU-${UNIQUE}","status":"ACTIVE","metadata":{"e2e":true}}
EOF
)
smoke_module "products" "$P"

log_step 2 "UH-2 ProductVariant"
P=$(cat <<EOF
{"name":"E2E PV ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PV-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "sku":"VSKU-${UNIQUE}","metadata":{"e2e":true}}
EOF
)
smoke_module "productvariants" "$P"

log_step 3 "UH-3 ProductAttribute"
P=$(cat <<EOF
{"name":"E2E PA ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PA-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "key":"color","value":"red","metadata":{"e2e":true}}
EOF
)
smoke_module "productattributes" "$P"

log_step 4 "UH-4 ProductPrice"
P=$(cat <<EOF
{"name":"E2E PP ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PP-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "amount":10.0,"currency":"EUR","metadata":{"e2e":true}}
EOF
)
smoke_module "productprices" "$P"

log_step 5 "UH-5 ProductInventory"
P=$(cat <<EOF
{"name":"E2E PI ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PI-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "quantity":100,"warehouse":"WH-1","metadata":{"e2e":true}}
EOF
)
smoke_module "productinventorys" "$P"

log_step 6 "UH-6 ProductMedia"
P=$(cat <<EOF
{"name":"E2E PM ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PM-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "mediaType":"IMAGE","url":"https://example.com/img.jpg","metadata":{"e2e":true}}
EOF
)
smoke_module "productmedias" "$P"

log_step 7 "UH-7 ProductSpecification"
P=$(cat <<EOF
{"name":"E2E PS ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PS-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "specKey":"weight","specValue":"1kg","metadata":{"e2e":true}}
EOF
)
smoke_module "productspecifications" "$P"

log_step 8 "UH-8 ProductRelationship"
P=$(cat <<EOF
{"name":"E2E PR ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PR-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "relatedProductId":"00000000-0000-0000-0000-000000000002","relationType":"UPSELL","metadata":{"e2e":true}}
EOF
)
smoke_module "productrelationships" "$P"

log_step 9 "UH-9 ProductPromotion"
P=$(cat <<EOF
{"name":"E2E PP ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PRM-${UNIQUE}","productId":"00000000-0000-0000-0000-000000000001",
 "discountPercent":10,"startDate":"${TIMESTAMP}","endDate":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "productpromotions" "$P"

log_step 10 "UH-10 CatalogSyncLog"
P=$(cat <<EOF
{"name":"E2E Log ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"categoryCode":"product-status","triggeredBy":"e2e-test",
 "itemsAddedCount":0,"itemsUpdatedCount":0,"itemsRemovedCount":0,
 "outcome":"SUCCESS","syncedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogsynclogs" "$P"

log_step 11 "UH-11 catalog-client"
smoke_catalog_client

log_step 12 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*product[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics product.* detectados"; else log_warn "Sin topics product.*"; fi
else log_warn "kcat no instalado — skipping"; fi

print_summary "product-service"
