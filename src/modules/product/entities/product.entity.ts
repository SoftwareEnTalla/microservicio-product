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
import { CreateProductDto, UpdateProductDto, DeleteProductDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';
import { ProductMedia } from '../../product-media/entities/product-media.entity';
import { ProductPrice } from '../../product-price/entities/product-price.entity';
import { ProductPromotion } from '../../product-promotion/entities/product-promotion.entity';
import { ProductInventory } from '../../product-inventory/entities/product-inventory.entity';

@Index('idx_product_code', ['code'], { unique: true })
@Index('idx_product_slug', ['slug'], { unique: true })
@Index('idx_product_status_visibility', ['status', 'visibility'])
@Unique('uq_product_code', ['code'])
@Unique('uq_product_slug', ['slug'])
@ChildEntity('product')
@ObjectType()
export class Product extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Product",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Product", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Product' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Product",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Product", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Product' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código interno del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código interno del producto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 60, unique: true, comment: 'Código interno del producto' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Slug único del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Slug único del producto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 160, unique: true, comment: 'Slug único del producto' })
  slug!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descripción corta',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descripción corta', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Descripción corta' })
  shortDescription?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descripción larga',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descripción larga', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Descripción larga' })
  longDescription?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del producto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'DRAFT', comment: 'Estado del producto' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Visibilidad del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Visibilidad del producto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'PRIVATE', comment: 'Visibilidad del producto' })
  visibility!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Marca del producto',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Marca del producto', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Marca del producto' })
  brandId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría principal del producto',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría principal del producto', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Categoría principal del producto' })
  primaryCategoryId!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Categorías adicionales jerárquicas',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Categorías adicionales jerárquicas', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Categorías adicionales jerárquicas' })
  additionalCategoryIds?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'SEO meta title',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'SEO meta title', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'SEO meta title' })
  metaTitle?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'SEO meta description',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'SEO meta description', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'SEO meta description' })
  metaDescription?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Palabras clave SEO',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Palabras clave SEO', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Palabras clave SEO' })
  keywords?: Record<string, any> = {};

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si el producto usa variantes',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si el producto usa variantes', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Indica si el producto usa variantes' })
  hasVariants!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda por defecto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda por defecto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'USD', comment: 'Moneda por defecto' })
  defaultCurrency!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de publicación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de publicación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de publicación' })
  publishedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de archivado',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de archivado', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de archivado' })
  archivedAt?: Date = new Date();

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos extendidos del producto',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos extendidos del producto', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos extendidos del producto' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => [ProductVariant],
    nullable: true,
    description: 'Variantes del producto',
  })
  @Field(() => [ProductVariant], { nullable: true })
  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  variants?: ProductVariant[];

  @ApiProperty({
    type: () => [ProductMedia],
    nullable: true,
    description: 'Media principal del producto',
  })
  @Field(() => [ProductMedia], { nullable: true })
  @OneToMany(() => ProductMedia, (productMedia) => productMedia.product)
  mediaItems?: ProductMedia[];

  @ApiProperty({
    type: () => [ProductPrice],
    nullable: true,
    description: 'Precios asociados',
  })
  @Field(() => [ProductPrice], { nullable: true })
  @OneToMany(() => ProductPrice, (productPrice) => productPrice.product)
  prices?: ProductPrice[];

  @ApiProperty({
    type: () => [ProductPromotion],
    nullable: true,
    description: 'Promociones asociadas',
  })
  @Field(() => [ProductPromotion], { nullable: true })
  @OneToMany(() => ProductPromotion, (productPromotion) => productPromotion.product)
  promotions?: ProductPromotion[];

  @ApiProperty({
    type: () => [ProductInventory],
    nullable: true,
    description: 'Inventario del producto',
  })
  @Field(() => [ProductInventory], { nullable: true })
  @OneToMany(() => ProductInventory, (productInventory) => productInventory.product)
  inventories?: ProductInventory[];

  protected executeDslLifecycle(): void {
    // Rule: active-product-must-have-media
    // Un producto activo requiere al menos una imagen.
    if (!(this.status === 'ACTIVE')) {
      throw new Error('PRODUCT_001: El producto activo requiere media visual mínima');
    }

    // Rule: public-product-must-be-active
    // Un producto público debe estar activo.
    if (!(this.visibility === 'PUBLIC' && this.status === 'ACTIVE')) {
      throw new Error('PRODUCT_002: La visibilidad pública exige estado activo');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'product';
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
  static fromDto(dto: CreateProductDto): Product;
  static fromDto(dto: UpdateProductDto): Product;
  static fromDto(dto: DeleteProductDto): Product;
  static fromDto(dto: any): Product {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Product, dto);
  }
}
