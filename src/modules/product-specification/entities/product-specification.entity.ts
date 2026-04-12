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
import { CreateProductSpecificationDto, UpdateProductSpecificationDto, DeleteProductSpecificationDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';

@Index('idx_product_specification_scope', ['productId', 'groupName', 'position'])
@Check('chk_product_specification_position_positive', '"position" >= 1')
@ChildEntity('productspecification')
@ObjectType()
export class ProductSpecification extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductSpecification",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductSpecification", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductSpecification' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductSpecification",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductSpecification", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductSpecification' })
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
    description: 'Grupo visual de especificaciones',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Grupo visual de especificaciones', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Grupo visual de especificaciones' })
  groupName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código del grupo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código del grupo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Código del grupo' })
  groupCode?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden visual',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden visual', nullable: false })
  @Column({ type: 'int', nullable: false, default: 1, comment: 'Orden visual' })
  position!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave interna',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave interna', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Clave interna' })
  specKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etiqueta visible',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etiqueta visible', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 150, comment: 'Etiqueta visible' })
  label!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Valor visible',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Valor visible', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Valor visible' })
  value!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de valor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de valor', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'TEXT', comment: 'Tipo de valor' })
  valueType!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Determina si se muestra en ficha',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Determina si se muestra en ficha', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: true, comment: 'Determina si se muestra en ficha' })
  isVisible!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la especificación',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de la especificación', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de la especificación' })
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
    // Rule: product-specification-key-required
    // Toda especificación requiere clave y valor.
    if (!(!(this.specKey === undefined || this.specKey === null || (typeof this.specKey === 'string' && String(this.specKey).trim() === '') || (Array.isArray(this.specKey) && this.specKey.length === 0) || (typeof this.specKey === 'object' && !Array.isArray(this.specKey) && Object.prototype.toString.call(this.specKey) === '[object Object]' && Object.keys(Object(this.specKey)).length === 0)) && !(this.value === undefined || this.value === null || (typeof this.value === 'string' && String(this.value).trim() === '') || (Array.isArray(this.value) && this.value.length === 0) || (typeof this.value === 'object' && !Array.isArray(this.value) && Object.prototype.toString.call(this.value) === '[object Object]' && Object.keys(Object(this.value)).length === 0)))) {
      throw new Error('PRODUCT_SPECIFICATION_001: La especificación requiere clave y valor');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productspecification';
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
  static fromDto(dto: CreateProductSpecificationDto): ProductSpecification;
  static fromDto(dto: UpdateProductSpecificationDto): ProductSpecification;
  static fromDto(dto: DeleteProductSpecificationDto): ProductSpecification;
  static fromDto(dto: any): ProductSpecification {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductSpecification, dto);
  }
}
