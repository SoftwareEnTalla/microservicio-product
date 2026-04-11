/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateProductVariantDto, UpdateProductVariantDto, DeleteProductVariantDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
import { ProductMedia } from '../../product-media/entities/product-media.entity';
import { ProductPrice } from '../../product-price/entities/product-price.entity';
import { ProductPromotion } from '../../product-promotion/entities/product-promotion.entity';
import { ProductInventory } from '../../product-inventory/entities/product-inventory.entity';

@Index('idx_product_variant_sku', ['sku'], { unique: true })
@Index('idx_product_variant_product_status', ['productId', 'status'])
@Unique('uq_product_variant_sku', ['sku'])
@ChildEntity('productvariant')
@ObjectType()
export class ProductVariant extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductVariant",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductVariant", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductVariant' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductVariant",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductVariant", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductVariant' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto padre',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto padre', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Producto padre' })
  productId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'SKU único de la variante',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'SKU único de la variante', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'SKU único de la variante' })
  sku!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código de barras',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código de barras', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, unique: true, comment: 'Código de barras' })
  barcode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la variante',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la variante', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'INACTIVE', comment: 'Estado de la variante' })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Precio base de la variante',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Precio base de la variante', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Precio base de la variante' })
  basePrice?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Precio comparativo',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Precio comparativo', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Precio comparativo' })
  compareAtPrice?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda base',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda base', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'USD', comment: 'Moneda base' })
  currency!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Peso',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Peso', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 3, comment: 'Peso' })
  weight?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Largo',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Largo', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 3, comment: 'Largo' })
  length?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Ancho',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Ancho', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 3, comment: 'Ancho' })
  width?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Alto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Alto', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 3, comment: 'Alto' })
  height?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si posee media propia',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si posee media propia', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Indica si posee media propia' })
  hasOwnMedia!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la variante',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos de la variante', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de la variante' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => Product,
    nullable: false,
    description: 'Relación con Product',
  })
  @Field(() => Product, { nullable: false })
  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @ApiProperty({
    type: () => [ProductMedia],
    nullable: true,
    description: 'Media específica de variante',
  })
  @Field(() => [ProductMedia], { nullable: true })
  @OneToMany(() => ProductMedia, (productMedia) => productMedia.variant)
  mediaItems?: ProductMedia[];

  @ApiProperty({
    type: () => [ProductPrice],
    nullable: true,
    description: 'Precios de variante',
  })
  @Field(() => [ProductPrice], { nullable: true })
  @OneToMany(() => ProductPrice, (productPrice) => productPrice.variant)
  prices?: ProductPrice[];

  @ApiProperty({
    type: () => [ProductPromotion],
    nullable: true,
    description: 'Promociones específicas',
  })
  @Field(() => [ProductPromotion], { nullable: true })
  @OneToMany(() => ProductPromotion, (productPromotion) => productPromotion.variant)
  promotions?: ProductPromotion[];

  @ApiProperty({
    type: () => [ProductInventory],
    nullable: true,
    description: 'Inventario de variante',
  })
  @Field(() => [ProductInventory], { nullable: true })
  @OneToMany(() => ProductInventory, (productInventory) => productInventory.variant)
  inventories?: ProductInventory[];

  protected executeDslLifecycle(): void {
    // Rule: variant-must-reference-product
    // Toda variante debe referenciar un producto padre.
    if (!(!(this.productId === undefined || this.productId === null || (typeof this.productId === 'string' && String(this.productId).trim() === '') || (Array.isArray(this.productId) && this.productId.length === 0) || (typeof this.productId === 'object' && !Array.isArray(this.productId) && Object.prototype.toString.call(this.productId) === '[object Object]' && Object.keys(Object(this.productId)).length === 0)))) {
      throw new Error('PRODUCT_VARIANT_001: La variante requiere productId');
    }

    // Rule: variant-sku-required
    // Toda variante vendible debe tener SKU.
    if (!(!(this.sku === undefined || this.sku === null || (typeof this.sku === 'string' && String(this.sku).trim() === '') || (Array.isArray(this.sku) && this.sku.length === 0) || (typeof this.sku === 'object' && !Array.isArray(this.sku) && Object.prototype.toString.call(this.sku) === '[object Object]' && Object.keys(Object(this.sku)).length === 0)))) {
      throw new Error('PRODUCT_VARIANT_002: La variante requiere SKU único');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productvariant';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateProductVariantDto): ProductVariant;
  static fromDto(dto: UpdateProductVariantDto): ProductVariant;
  static fromDto(dto: DeleteProductVariantDto): ProductVariant;
  static fromDto(dto: any): ProductVariant {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductVariant, dto);
  }
}
