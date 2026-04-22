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
import { CreateProductPriceDto, UpdateProductPriceDto, DeleteProductPriceDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Index('idx_product_price_scope_currency', ['productId', 'currency', 'status'])
@Check('chk_product_price_amount_positive', '"amount" > 0')
@ChildEntity('productprice')
@ObjectType()
export class ProductPrice extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductPrice",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductPrice", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductPrice' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductPrice",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductPrice", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductPrice' })
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
    description: 'Moneda del precio',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda del precio', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'USD', comment: 'Moneda del precio' })
  currency!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Monto principal',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Monto principal', nullable: false })
  @Column({ type: 'decimal', nullable: false, precision: 12, scale: 2, comment: 'Monto principal' })
  amount!: number;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Monto comparativo',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Monto comparativo', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 2, comment: 'Monto comparativo' })
  compareAtAmount?: number = 0;

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
    description: 'Tipo de precio',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de precio', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'BASE', comment: 'Tipo de precio' })
  priceType!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Es precio principal',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Es precio principal', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Es precio principal' })
  isDefault!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del precio',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del precio', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado del precio' })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del precio',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos del precio', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos del precio' })
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
    // Rule: product-price-amount-must-be-positive
    // Todo precio debe tener monto positivo.
    if (!(this.amount > 0)) {
      throw new Error('PRODUCT_PRICE_001: El monto del precio debe ser mayor que cero');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productprice';
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
  static fromDto(dto: CreateProductPriceDto): ProductPrice;
  static fromDto(dto: UpdateProductPriceDto): ProductPrice;
  static fromDto(dto: DeleteProductPriceDto): ProductPrice;
  static fromDto(dto: any): ProductPrice {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductPrice, dto);
  }
}
