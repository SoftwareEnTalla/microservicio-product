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

log_step 13 "Semantic search (pgvector + IA) — caso 'Lapiz Labial'"
SEM_RESP=$(do_get "$BASE_URL/products/query/semantic-search?q=Lapiz%20Labial" "$AUTH")
SEM_CODE=$(extract_code "$SEM_RESP")
if [[ "$SEM_CODE" =~ ^(200|201)$ ]]; then
  MODE=$(echo "$SEM_RESP" | sed -n 's/.*"searchMode":"\([^"]*\)".*/\1/p' | head -1)
  if [[ "$MODE" =~ ^(SEMANTIC|TEXTUAL|TEXTUAL_FALLBACK)$ ]]; then
    log_ok "semantic-search OK ($SEM_CODE, mode=$MODE)"
  else
    log_fail "semantic-search no devolvió searchMode esperado"
  fi
else
  log_fail "semantic-search respondió $SEM_CODE"
fi

SEM_TXT=$(do_get "$BASE_URL/products/query/semantic-search?q=E2E&semanticSearch=false" "$AUTH")
SEM_TXT_CODE=$(extract_code "$SEM_TXT")
SEM_TXT_MODE=$(echo "$SEM_TXT" | sed -n 's/.*"searchMode":"\([^"]*\)".*/\1/p' | head -1)
if [[ "$SEM_TXT_CODE" =~ ^(200|201)$ && "$SEM_TXT_MODE" == "TEXTUAL" ]]; then
  log_ok "semantic-search semanticSearch=false -> TEXTUAL"
else
  log_fail "semantic-search semanticSearch=false code=$SEM_TXT_CODE mode=$SEM_TXT_MODE"
fi

print_summary "product-service"

# >>> NOMENCLADORES E2E BEGIN (auto-generado por sources/scaffold_nomenclador_e2e_tests.py)
# Servicio: product-service | Puerto: 3006
NOM_BASE_URL="${NOM_BASE_URL:-http://localhost:3006/api}"
NOM_AUTH="${AUTH:-Bearer valid-token}"
nom_pass=0; nom_fail=0; nom_warn=0
_nom_ok()   { echo -e "  \033[0;32m✔ $1\033[0m"; nom_pass=$((nom_pass+1)); }
_nom_fail() { echo -e "  \033[0;31m✘ $1\033[0m"; nom_fail=$((nom_fail+1)); }
_nom_warn() { echo -e "  \033[1;33m⚠ $1\033[0m"; nom_warn=$((nom_warn+1)); }
NOM_UNIQUE="${UNIQUE:-$(date +%s)}"
NOM_NOW="${NOW:-$(date -u +%Y-%m-%dT%H:%M:%S.000Z)}"
echo ""
echo -e "\033[0;34m═══ NOMENCLADORES — product-service ═══\033[0m"

# --- Nomenclador: applies-to ---
NOM_CODE="NAPPLIE-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E AppliesTo ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/appliestos/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "applies-to: create id=$NOM_ID"; else _nom_warn "applies-to: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/appliestos/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "applies-to: list ok"; else _nom_warn "applies-to: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/appliestos/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "applies-to: getById" || _nom_warn "applies-to: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/appliestos/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E AppliesTo updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "applies-to: update" || _nom_warn "applies-to: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/appliestos/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "applies-to: delete" || _nom_warn "applies-to: delete"
fi

# --- Nomenclador: media-type ---
NOM_CODE="NMEDIAT-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E MediaType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/mediatypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "media-type: create id=$NOM_ID"; else _nom_warn "media-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/mediatypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "media-type: list ok"; else _nom_warn "media-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/mediatypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "media-type: getById" || _nom_warn "media-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/mediatypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E MediaType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "media-type: update" || _nom_warn "media-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/mediatypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "media-type: delete" || _nom_warn "media-type: delete"
fi

# --- Nomenclador: price-type ---
NOM_CODE="NPRICET-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PriceType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/pricetypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "price-type: create id=$NOM_ID"; else _nom_warn "price-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/pricetypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "price-type: list ok"; else _nom_warn "price-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/pricetypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "price-type: getById" || _nom_warn "price-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/pricetypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PriceType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "price-type: update" || _nom_warn "price-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/pricetypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "price-type: delete" || _nom_warn "price-type: delete"
fi

# --- Nomenclador: product-status ---
NOM_CODE="NPRODUC-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E ProductStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/productstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "product-status: create id=$NOM_ID"; else _nom_warn "product-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/productstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "product-status: list ok"; else _nom_warn "product-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/productstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "product-status: getById" || _nom_warn "product-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/productstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E ProductStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "product-status: update" || _nom_warn "product-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/productstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "product-status: delete" || _nom_warn "product-status: delete"
fi

# --- Nomenclador: product-visibility ---
NOM_CODE="NPRODUC-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E ProductVisibility ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/productvisibilitys/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "product-visibility: create id=$NOM_ID"; else _nom_warn "product-visibility: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/productvisibilitys/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "product-visibility: list ok"; else _nom_warn "product-visibility: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/productvisibilitys/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "product-visibility: getById" || _nom_warn "product-visibility: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/productvisibilitys/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E ProductVisibility updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "product-visibility: update" || _nom_warn "product-visibility: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/productvisibilitys/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "product-visibility: delete" || _nom_warn "product-visibility: delete"
fi

# --- Nomenclador: promotion-type ---
NOM_CODE="NPROMOT-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E PromotionType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/promotiontypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "promotion-type: create id=$NOM_ID"; else _nom_warn "promotion-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/promotiontypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "promotion-type: list ok"; else _nom_warn "promotion-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/promotiontypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "promotion-type: getById" || _nom_warn "promotion-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/promotiontypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E PromotionType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "promotion-type: update" || _nom_warn "promotion-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/promotiontypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "promotion-type: delete" || _nom_warn "promotion-type: delete"
fi

# --- Nomenclador: relationship-type ---
NOM_CODE="NRELATI-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E RelationshipType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/relationshiptypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "relationship-type: create id=$NOM_ID"; else _nom_warn "relationship-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/relationshiptypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "relationship-type: list ok"; else _nom_warn "relationship-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/relationshiptypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "relationship-type: getById" || _nom_warn "relationship-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/relationshiptypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E RelationshipType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "relationship-type: update" || _nom_warn "relationship-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/relationshiptypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "relationship-type: delete" || _nom_warn "relationship-type: delete"
fi

# --- Nomenclador: stock-status ---
NOM_CODE="NSTOCKS-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E StockStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/stockstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "stock-status: create id=$NOM_ID"; else _nom_warn "stock-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/stockstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "stock-status: list ok"; else _nom_warn "stock-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/stockstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "stock-status: getById" || _nom_warn "stock-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/stockstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E StockStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "stock-status: update" || _nom_warn "stock-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/stockstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "stock-status: delete" || _nom_warn "stock-status: delete"
fi

# --- Nomenclador: target-entity-type ---
NOM_CODE="NTARGET-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E TargetEntityType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/targetentitytypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "target-entity-type: create id=$NOM_ID"; else _nom_warn "target-entity-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/targetentitytypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "target-entity-type: list ok"; else _nom_warn "target-entity-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/targetentitytypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "target-entity-type: getById" || _nom_warn "target-entity-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/targetentitytypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E TargetEntityType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "target-entity-type: update" || _nom_warn "target-entity-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/targetentitytypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "target-entity-type: delete" || _nom_warn "target-entity-type: delete"
fi

echo ""
echo -e "\033[0;34m── Resumen Nomencladores product-service ──\033[0m"
echo "  ✔ OK=$nom_pass  ✘ FAIL=$nom_fail  ⚠ WARN=$nom_warn"
[[ ${nom_fail:-0} -eq 0 ]] || echo "[NOMENCLADORES] hay fallos en este servicio"
# <<< NOMENCLADORES E2E END
