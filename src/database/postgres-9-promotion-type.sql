-- ====================================================================
-- promotion_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "promotion_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('PERCENTAGE', 'Percentage', '', '{}'::jsonb, 'system', TRUE, 'promotiontype'),
  ('FIXED_AMOUNT', 'Fixed Amount', '', '{}'::jsonb, 'system', TRUE, 'promotiontype'),
  ('SPECIAL_PRICE', 'Special Price', '', '{}'::jsonb, 'system', TRUE, 'promotiontype'),
  ('VOLUME', 'Volume', '', '{}'::jsonb, 'system', TRUE, 'promotiontype'),
  ('COUPON', 'Coupon', '', '{}'::jsonb, 'system', TRUE, 'promotiontype'),
  ('SEGMENTED', 'Segmented', '', '{}'::jsonb, 'system', TRUE, 'promotiontype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
