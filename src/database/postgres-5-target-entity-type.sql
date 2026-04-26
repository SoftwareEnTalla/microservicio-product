-- ====================================================================
-- target_entity_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "target_entity_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('PRODUCT', 'Product', '', '{}'::jsonb, 'system', TRUE, 'targetentitytype'),
  ('PRODUCT_VARIANT', 'Product Variant', '', '{}'::jsonb, 'system', TRUE, 'targetentitytype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
