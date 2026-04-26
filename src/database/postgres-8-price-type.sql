-- ====================================================================
-- price_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "price_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('BASE', 'Base', '', '{}'::jsonb, 'system', TRUE, 'pricetype'),
  ('LIST', 'List', '', '{}'::jsonb, 'system', TRUE, 'pricetype'),
  ('PROMOTIONAL', 'Promotional', '', '{}'::jsonb, 'system', TRUE, 'pricetype'),
  ('SPECIAL', 'Special', '', '{}'::jsonb, 'system', TRUE, 'pricetype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
