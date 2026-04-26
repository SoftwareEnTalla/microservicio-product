-- ════════════════════════════════════════════════════════════════════
-- product_visibility_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "product_visibility_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('PUBLIC', 'Público', 'Visible al público general', jsonb_build_object('description','Visible al público general'), 'system', TRUE, 'productvisibility'),
  ('PRIVATE', 'Privado', 'Solo visible para clientes autorizados', jsonb_build_object('description','Solo visible para clientes autorizados'), 'system', TRUE, 'productvisibility')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
