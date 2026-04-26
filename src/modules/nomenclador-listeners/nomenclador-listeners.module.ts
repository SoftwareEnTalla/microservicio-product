/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 *
 * NomencladorListenersModule — registra los listeners on<Nomenclador>Change
 * para todos los nomencladores referenciados por las entidades de este
 * microservicio. Se importa una sola vez desde app.module.ts.
 *
 * Generado por sources/scaffold_nomenclador_listeners.py — NO editar a mano.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { OnActiveStatusChangeListener } from './on-active-status-change.listener';
import { OnActiveStatusExpirableChangeListener } from './on-active-status-expirable-change.listener';
import { OnAppliesToChangeListener } from './on-applies-to-change.listener';
import { OnCurrencyCodeChangeListener } from './on-currency-code-change.listener';
import { OnMediaTypeChangeListener } from './on-media-type-change.listener';
import { OnPriceTypeChangeListener } from './on-price-type-change.listener';
import { OnProductStatusChangeListener } from './on-product-status-change.listener';
import { OnProductVisibilityChangeListener } from './on-product-visibility-change.listener';
import { OnPromotionTypeChangeListener } from './on-promotion-type-change.listener';
import { OnRelationshipTypeChangeListener } from './on-relationship-type-change.listener';
import { OnStockStatusChangeListener } from './on-stock-status-change.listener';
import { OnTargetEntityTypeChangeListener } from './on-target-entity-type-change.listener';

@Module({
  imports: [ConfigModule, CqrsModule],
  providers: [
    OnActiveStatusChangeListener,
    OnActiveStatusExpirableChangeListener,
    OnAppliesToChangeListener,
    OnCurrencyCodeChangeListener,
    OnMediaTypeChangeListener,
    OnPriceTypeChangeListener,
    OnProductStatusChangeListener,
    OnProductVisibilityChangeListener,
    OnPromotionTypeChangeListener,
    OnRelationshipTypeChangeListener,
    OnStockStatusChangeListener,
    OnTargetEntityTypeChangeListener,
  ],
  exports: [
    OnActiveStatusChangeListener,
    OnActiveStatusExpirableChangeListener,
    OnAppliesToChangeListener,
    OnCurrencyCodeChangeListener,
    OnMediaTypeChangeListener,
    OnPriceTypeChangeListener,
    OnProductStatusChangeListener,
    OnProductVisibilityChangeListener,
    OnPromotionTypeChangeListener,
    OnRelationshipTypeChangeListener,
    OnStockStatusChangeListener,
    OnTargetEntityTypeChangeListener,
  ],
})
export class NomencladorListenersModule {}
