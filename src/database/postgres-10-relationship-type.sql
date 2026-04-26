-- ====================================================================
-- relationship_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "relationship_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('RELATED', 'Related', '', '{}'::jsonb, 'system', TRUE, 'relationshiptype'),
  ('UPSELL', 'Upsell', '', '{}'::jsonb, 'system', TRUE, 'relationshiptype'),
  ('CROSS_SELL', 'Cross Sell', '', '{}'::jsonb, 'system', TRUE, 'relationshiptype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
