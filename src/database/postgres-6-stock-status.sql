-- ====================================================================
-- stock_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "stock_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('IN_STOCK', 'In Stock', '', '{}'::jsonb, 'system', TRUE, 'stockstatus'),
  ('LOW_STOCK', 'Low Stock', '', '{}'::jsonb, 'system', TRUE, 'stockstatus'),
  ('OUT_OF_STOCK', 'Out Of Stock', '', '{}'::jsonb, 'system', TRUE, 'stockstatus'),
  ('PREORDER', 'Preorder', '', '{}'::jsonb, 'system', TRUE, 'stockstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
