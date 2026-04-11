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
import { CreateProductInventoryDto, UpdateProductInventoryDto, DeleteProductInventoryDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Index('idx_product_inventory_scope', ['productId', 'variantId', 'warehouseId'])
@Check('chk_product_inventory_available_stock_non_negative', '"availableStock" >= 0')
@Check('chk_product_inventory_reserved_stock_non_negative', '"reservedStock" >= 0')
@ChildEntity('productinventory')
@ObjectType()
export class ProductInventory extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductInventory",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductInventory", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductInventory' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductInventory",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductInventory", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductInventory' })
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
    nullable: true,
    description: 'Almacén o ubicación',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Almacén o ubicación', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Almacén o ubicación' })
  warehouseId?: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Stock disponible',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Stock disponible', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Stock disponible' })
  availableStock!: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Stock reservado',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Stock reservado', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Stock reservado' })
  reservedStock!: number;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Stock entrante',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Stock entrante', nullable: true })
  @Column({ type: 'int', nullable: true, default: 0, comment: 'Stock entrante' })
  incomingStock?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Punto de reposición',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Punto de reposición', nullable: true })
  @Column({ type: 'int', nullable: true, default: 0, comment: 'Punto de reposición' })
  reorderPoint?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Permite backorder',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Permite backorder', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Permite backorder' })
  backorderAllowed!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de disponibilidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de disponibilidad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'IN_STOCK', comment: 'Estado de disponibilidad' })
  stockStatus!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de inventario',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos de inventario', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de inventario' })
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
    // Rule: reserved-stock-cannot-exceed-total-visible-stock
    // El stock reservado no debe superar el stock disponible más entrante sin política explícita.
    if (this.reservedStock >= 0) {
      console.warn('PRODUCT_INVENTORY_001: Verificar consistencia entre stock reservado y stock visible');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productinventory';
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
  static fromDto(dto: CreateProductInventoryDto): ProductInventory;
  static fromDto(dto: UpdateProductInventoryDto): ProductInventory;
  static fromDto(dto: DeleteProductInventoryDto): ProductInventory;
  static fromDto(dto: any): ProductInventory {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductInventory, dto);
  }
}
