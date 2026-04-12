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
import { CreateProductPromotionDto, UpdateProductPromotionDto, DeleteProductPromotionDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Index('idx_product_promotion_scope_status', ['productId', 'status', 'priority'])
@Check('chk_product_promotion_priority_positive', '"priority" >= 1')
@ChildEntity('productpromotion')
@ObjectType()
export class ProductPromotion extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductPromotion",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductPromotion", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductPromotion' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductPromotion",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductPromotion", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductPromotion' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto asociado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Producto asociado' })
  productId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Variante opcional asociada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Variante opcional asociada', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Variante opcional asociada' })
  variantId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de promoción',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de promoción', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Tipo de promoción' })
  promotionType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código promocional o interno',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código promocional o interno', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, unique: true, comment: 'Código promocional o interno' })
  code?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de evaluación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de evaluación', nullable: false })
  @Column({ type: 'int', nullable: false, default: 1, comment: 'Prioridad de evaluación' })
  priority!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Puede acumularse',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Puede acumularse', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Puede acumularse' })
  stackable!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Descuento porcentual',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Descuento porcentual', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 5, scale: 2, comment: 'Descuento porcentual' })
  discountPercent?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Descuento fijo',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Descuento fijo', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Descuento fijo' })
  discountAmount?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Precio especial',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Precio especial', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Precio especial' })
  specialPrice?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cupón asociado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Cupón asociado', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Cupón asociado' })
  couponCode?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Cantidad mínima para promoción por volumen',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Cantidad mínima para promoción por volumen', nullable: true })
  @Column({ type: 'int', nullable: true, comment: 'Cantidad mínima para promoción por volumen' })
  minQuantity?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Segmento objetivo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Segmento objetivo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Segmento objetivo' })
  segment?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Inicio de vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Inicio de vigencia', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Inicio de vigencia' })
  validFrom?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fin de vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fin de vigencia', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fin de vigencia' })
  validTo?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la promoción',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la promoción', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado de la promoción' })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la promoción',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de la promoción', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de la promoción' })
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
    type: () => ProductVariant,
    nullable: true,
    description: 'Relación con ProductVariant',
  })
  @Field(() => ProductVariant, { nullable: true })
  @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variantId' })
  variant?: ProductVariant;

  protected executeDslLifecycle(): void {
    // Rule: promotion-must-have-price-effect
    // Toda promoción debe definir algún efecto económico.
    if (!(this.discountPercent === undefined || this.discountPercent === null || (typeof this.discountPercent === 'string' && String(this.discountPercent).trim() === '') || (Array.isArray(this.discountPercent) && this.discountPercent.length === 0) || (typeof this.discountPercent === 'object' && !Array.isArray(this.discountPercent) && Object.prototype.toString.call(this.discountPercent) === '[object Object]' && Object.keys(Object(this.discountPercent)).length === 0))) {
      console.warn('PRODUCT_PROMOTION_001: Verificar que la promoción tenga descuento porcentual, fijo o precio especial');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productpromotion';
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
  static fromDto(dto: CreateProductPromotionDto): ProductPromotion;
  static fromDto(dto: UpdateProductPromotionDto): ProductPromotion;
  static fromDto(dto: DeleteProductPromotionDto): ProductPromotion;
  static fromDto(dto: any): ProductPromotion {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductPromotion, dto);
  }
}
