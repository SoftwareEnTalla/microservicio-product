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
import { CreateProductMediaDto, UpdateProductMediaDto, DeleteProductMediaDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Index('idx_product_media_product_position', ['productId', 'position'])
@Check('chk_product_media_position_positive', '"position" >= 1')
@ChildEntity('productmedia')
@ObjectType()
export class ProductMedia extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductMedia",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductMedia", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductMedia' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductMedia",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductMedia", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductMedia' })
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
    description: 'Tipo de media',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de media', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'IMAGE', comment: 'Tipo de media' })
  mediaType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'URL o localizador del recurso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'URL o localizador del recurso', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'URL o localizador del recurso' })
  url!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Clave de almacenamiento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Clave de almacenamiento', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Clave de almacenamiento' })
  storageKey?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Texto alternativo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Texto alternativo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Texto alternativo' })
  altText?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden de visualización',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden de visualización', nullable: false })
  @Column({ type: 'int', nullable: false, default: 1, comment: 'Orden de visualización' })
  position!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Marca si es la media principal',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Marca si es la media principal', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Marca si es la media principal' })
  isPrimary!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del recurso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del recurso', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado del recurso' })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del recurso',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos del recurso', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos del recurso' })
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
    // Rule: product-media-url-required
    // Todo recurso de media debe tener una URL válida.
    if (!(!(this.url === undefined || this.url === null || (typeof this.url === 'string' && String(this.url).trim() === '') || (Array.isArray(this.url) && this.url.length === 0) || (typeof this.url === 'object' && !Array.isArray(this.url) && Object.prototype.toString.call(this.url) === '[object Object]' && Object.keys(Object(this.url)).length === 0)))) {
      throw new Error('PRODUCT_MEDIA_001: La media requiere una URL o referencia válida');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productmedia';
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
  static fromDto(dto: CreateProductMediaDto): ProductMedia;
  static fromDto(dto: UpdateProductMediaDto): ProductMedia;
  static fromDto(dto: DeleteProductMediaDto): ProductMedia;
  static fromDto(dto: any): ProductMedia {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductMedia, dto);
  }
}
