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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseProductVariantDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProductVariant',
    example: 'Nombre de instancia CreateProductVariant',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductVariantDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProductVariant).',
    example: 'Fecha de creación de la instancia (CreateProductVariant).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProductVariant).',
    example: 'Fecha de actualización de la instancia (CreateProductVariant).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProductVariant).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProductVariant).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProductVariant).',
    example: 'Estado de activación de la instancia (CreateProductVariant).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto padre',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto padre', nullable: false })
  productId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'SKU único de la variante',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'SKU único de la variante', nullable: false })
  sku!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código de barras',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código de barras', nullable: true })
  barcode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la variante',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la variante', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Precio base de la variante',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Precio base de la variante', nullable: true })
  basePrice?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Precio comparativo',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Precio comparativo', nullable: true })
  compareAtPrice?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda base',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda base', nullable: false })
  currency!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Peso',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Peso', nullable: true })
  weight?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Largo',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Largo', nullable: true })
  length?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Ancho',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Ancho', nullable: true })
  width?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Alto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Alto', nullable: true })
  height?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si posee media propia',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si posee media propia', nullable: false })
  hasOwnMedia!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la variante',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de la variante', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductVariantDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductVariantDto extends BaseProductVariantDto {
  // Propiedades específicas de la clase ProductVariantDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<ProductVariantDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductVariantDto>): ProductVariantDto {
    const instance = new ProductVariantDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductVariantValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductVariantDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductVariantDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductVariantOutPutDto extends BaseProductVariantDto {
  // Propiedades específicas de la clase ProductVariantOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<ProductVariantOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductVariantOutPutDto>): ProductVariantOutPutDto {
    const instance = new ProductVariantOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductVariantDto extends BaseProductVariantDto {
  // Propiedades específicas de la clase CreateProductVariantDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProductVariant a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductVariantDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductVariantDto>): CreateProductVariantDto {
    const instance = new CreateProductVariantDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductVariantDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateProductVariantDto,
    description: 'Instancia CreateProductVariant o UpdateProductVariant',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductVariantDto, { nullable: true })
  input?: CreateProductVariantDto | UpdateProductVariantDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductVariantDto {
  // Propiedades específicas de la clase DeleteProductVariantDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProductVariant a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteProductVariant a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductVariantDto extends BaseProductVariantDto {
  // Propiedades específicas de la clase UpdateProductVariantDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProductVariant a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductVariantDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductVariantDto>): UpdateProductVariantDto {
    const instance = new UpdateProductVariantDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

