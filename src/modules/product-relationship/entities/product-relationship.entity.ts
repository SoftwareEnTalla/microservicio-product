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
import { CreateProductRelationshipDto, UpdateProductRelationshipDto, DeleteProductRelationshipDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_product_relationship_source_type', ['sourceProductId', 'relationshipType', 'priority'])
@Check('chk_product_relationship_priority_positive', '"priority" >= 1')
@ChildEntity('productrelationship')
@ObjectType()
export class ProductRelationship extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ProductRelationship",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ProductRelationship", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ProductRelationship' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ProductRelationship",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ProductRelationship", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ProductRelationship' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto origen',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto origen', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Producto origen' })
  sourceProductId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto relacionado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto relacionado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Producto relacionado' })
  targetProductId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de relación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de relación', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Tipo de relación' })
  relationshipType!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de recomendación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de recomendación', nullable: false })
  @Column({ type: 'int', nullable: false, default: 1, comment: 'Prioridad de recomendación' })
  priority!: number;

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
    description: 'Estado de la relación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la relación', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado de la relación' })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la relación',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de la relación', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de la relación' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: product-cannot-relate-to-itself
    // Un producto no debe relacionarse consigo mismo.
    if (!(!(this.sourceProductId === undefined || this.sourceProductId === null || (typeof this.sourceProductId === 'string' && String(this.sourceProductId).trim() === '') || (Array.isArray(this.sourceProductId) && this.sourceProductId.length === 0) || (typeof this.sourceProductId === 'object' && !Array.isArray(this.sourceProductId) && Object.prototype.toString.call(this.sourceProductId) === '[object Object]' && Object.keys(Object(this.sourceProductId)).length === 0)) && !(this.targetProductId === undefined || this.targetProductId === null || (typeof this.targetProductId === 'string' && String(this.targetProductId).trim() === '') || (Array.isArray(this.targetProductId) && this.targetProductId.length === 0) || (typeof this.targetProductId === 'object' && !Array.isArray(this.targetProductId) && Object.prototype.toString.call(this.targetProductId) === '[object Object]' && Object.keys(Object(this.targetProductId)).length === 0)))) {
      throw new Error('PRODUCT_RELATIONSHIP_001: La relación debe vincular productos distintos');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'productrelationship';
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
  static fromDto(dto: CreateProductRelationshipDto): ProductRelationship;
  static fromDto(dto: UpdateProductRelationshipDto): ProductRelationship;
  static fromDto(dto: DeleteProductRelationshipDto): ProductRelationship;
  static fromDto(dto: any): ProductRelationship {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ProductRelationship, dto);
  }
}
