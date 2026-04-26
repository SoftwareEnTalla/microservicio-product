-- ====================================================================
-- applies_to_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "applies_to_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('PRODUCT', 'Product', '', '{}'::jsonb, 'system', TRUE, 'appliesto'),
  ('VARIANT', 'Variant', '', '{}'::jsonb, 'system', TRUE, 'appliesto'),
  ('BOTH', 'Both', '', '{}'::jsonb, 'system', TRUE, 'appliesto')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
