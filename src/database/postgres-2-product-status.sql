-- ════════════════════════════════════════════════════════════════════
-- product_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "product_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('DRAFT', 'Borrador', 'Producto en preparación', jsonb_build_object('description','Producto en preparación'), 'system', TRUE, 'productstatus'),
  ('ACTIVE', 'Activo', 'Producto a la venta', jsonb_build_object('description','Producto a la venta'), 'system', TRUE, 'productstatus'),
  ('ARCHIVED', 'Archivado', 'Producto retirado del catálogo', jsonb_build_object('description','Producto retirado del catálogo'), 'system', TRUE, 'productstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
