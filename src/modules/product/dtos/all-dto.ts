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
export class BaseProductDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProduct',
    example: 'Nombre de instancia CreateProduct',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProduct).',
    example: 'Fecha de creación de la instancia (CreateProduct).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProduct).',
    example: 'Fecha de actualización de la instancia (CreateProduct).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProduct).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProduct).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProduct).',
    example: 'Estado de activación de la instancia (CreateProduct).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código interno del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código interno del producto', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Slug único del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Slug único del producto', nullable: false })
  slug!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descripción corta',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descripción corta', nullable: true })
  shortDescription?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descripción larga',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descripción larga', nullable: true })
  longDescription?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del producto', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Visibilidad del producto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Visibilidad del producto', nullable: false })
  visibility!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Marca del producto',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Marca del producto', nullable: true })
  brandId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría principal del producto',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría principal del producto', nullable: false })
  primaryCategoryId!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Categorías adicionales jerárquicas',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Categorías adicionales jerárquicas', nullable: true })
  additionalCategoryIds?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'SEO meta title',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'SEO meta title', nullable: true })
  metaTitle?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'SEO meta description',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'SEO meta description', nullable: true })
  metaDescription?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Palabras clave SEO',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Palabras clave SEO', nullable: true })
  keywords?: Record<string, any> = {};

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si el producto usa variantes',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si el producto usa variantes', nullable: false })
  hasVariants!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda por defecto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda por defecto', nullable: false })
  defaultCurrency!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de publicación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de publicación', nullable: true })
  publishedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de archivado',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de archivado', nullable: true })
  archivedAt?: Date = new Date();

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos extendidos del producto',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos extendidos del producto', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductDto extends BaseProductDto {
  // Propiedades específicas de la clase ProductDto en cuestión

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
  constructor(partial: Partial<ProductDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductDto>): ProductDto {
    const instance = new ProductDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductOutPutDto extends BaseProductDto {
  // Propiedades específicas de la clase ProductOutPutDto en cuestión

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
  constructor(partial: Partial<ProductOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductOutPutDto>): ProductOutPutDto {
    const instance = new ProductOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductDto extends BaseProductDto {
  // Propiedades específicas de la clase CreateProductDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProduct a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductDto>): CreateProductDto {
    const instance = new CreateProductDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductDto {
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
    type: () => CreateProductDto,
    description: 'Instancia CreateProduct o UpdateProduct',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductDto, { nullable: true })
  input?: CreateProductDto | UpdateProductDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductDto {
  // Propiedades específicas de la clase DeleteProductDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProduct a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProduct a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductDto extends BaseProductDto {
  // Propiedades específicas de la clase UpdateProductDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProduct a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductDto>): UpdateProductDto {
    const instance = new UpdateProductDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

