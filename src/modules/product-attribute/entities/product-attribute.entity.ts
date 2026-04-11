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
import { CreateProductAttributeDto, UpdateProductAttributeDto, DeleteProductAttributeDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';


@Index('idx_product_attribute_code', ['code'], { unique: true })
@Index('idx_product_attribute_target', ['targetEntityType', 'targetEntityId'])
@Unique('uq_product_attribute_code', ['code'])
@ChildEntity('productattribute')
@ObjectType()
export class ProductAttribute extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductAttribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductAttribute", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductAttribute' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductAttribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductAttribute", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductAttribute' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Grupo lógico del atributo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Grupo lógico del atributo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Grupo lógico del atributo' })
  groupCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del atributo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código del atributo' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 150, comment: 'Nombre visible' })
  displayName!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo del atributo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Tipo del atributo' })
  dataType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ámbito de aplicación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ámbito de aplicación', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'BOTH', comment: 'Ámbito de aplicación' })
  appliesTo!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica obligatoriedad',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica obligatoriedad', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Indica obligatoriedad' })
  isRequired!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Participa en filtros',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Participa en filtros', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Participa en filtros' })
  isFilterable!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Participa en búsqueda',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Participa en búsqueda', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Participa en búsqueda' })
  isSearchable!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Específico de variante',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Específico de variante', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Específico de variante' })
  isVariantSpecific!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Opciones para enum',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Opciones para enum', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Opciones para enum' })
  enumOptions?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de entidad objetivo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de entidad objetivo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'PRODUCT', comment: 'Tipo de entidad objetivo' })
  targetEntityType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Entidad portadora del valor',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Entidad portadora del valor', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Entidad portadora del valor' })
  targetEntityId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor string',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor string', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Valor string' })
  stringValue?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor numérico',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor numérico', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 12, scale: 3, comment: 'Valor numérico' })
  numericValue?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Valor booleano',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Valor booleano', nullable: true })
  @Column({ type: 'boolean', nullable: true, comment: 'Valor booleano' })
  booleanValue?: boolean = false;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor enum seleccionado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor enum seleccionado', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Valor enum seleccionado' })
  enumValue?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del atributo o valor',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos del atributo o valor', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos del atributo o valor' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: product-attribute-code-required
    // Todo atributo dinámico requiere un código único.
    if (!(!(this.code === undefined || this.code === null || (typeof this.code === 'string' && String(this.code).trim() === '') || (Array.isArray(this.code) && this.code.length === 0) || (typeof this.code === 'object' && !Array.isArray(this.code) && Object.prototype.toString.call(this.code) === '[object Object]' && Object.keys(Object(this.code)).length === 0)))) {
      throw new Error('PRODUCT_ATTRIBUTE_001: El atributo requiere código');
    }

    // Rule: enum-attribute-must-define-options
    // Los atributos enum deben declarar opciones.
    if (!(this.dataType === 'ENUM' && !(this.enumOptions === undefined || this.enumOptions === null || (typeof this.enumOptions === 'string' && String(this.enumOptions).trim() === '') || (Array.isArray(this.enumOptions) && this.enumOptions.length === 0) || (typeof this.enumOptions === 'object' && !Array.isArray(this.enumOptions) && Object.prototype.toString.call(this.enumOptions) === '[object Object]' && Object.keys(Object(this.enumOptions)).length === 0)))) {
      throw new Error('PRODUCT_ATTRIBUTE_002: Los atributos enum requieren opciones configuradas');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productattribute';
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
  static fromDto(dto: CreateProductAttributeDto): ProductAttribute;
  static fromDto(dto: UpdateProductAttributeDto): ProductAttribute;
  static fromDto(dto: DeleteProductAttributeDto): ProductAttribute;
  static fromDto(dto: any): ProductAttribute {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductAttribute, dto);
  }
}
