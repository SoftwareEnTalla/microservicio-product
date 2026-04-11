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
export class BaseProductMediaDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProductMedia',
    example: 'Nombre de instancia CreateProductMedia',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductMediaDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProductMedia).',
    example: 'Fecha de creación de la instancia (CreateProductMedia).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProductMedia).',
    example: 'Fecha de actualización de la instancia (CreateProductMedia).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProductMedia).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProductMedia).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProductMedia).',
    example: 'Estado de activación de la instancia (CreateProductMedia).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto asociado', nullable: false })
  productId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Variante opcional asociada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Variante opcional asociada', nullable: true })
  variantId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de media',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de media', nullable: false })
  mediaType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'URL o localizador del recurso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'URL o localizador del recurso', nullable: false })
  url!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Clave de almacenamiento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Clave de almacenamiento', nullable: true })
  storageKey?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Texto alternativo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Texto alternativo', nullable: true })
  altText?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden de visualización',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden de visualización', nullable: false })
  position!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Marca si es la media principal',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Marca si es la media principal', nullable: false })
  isPrimary!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del recurso',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del recurso', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del recurso',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos del recurso', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductMediaDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductMediaDto extends BaseProductMediaDto {
  // Propiedades específicas de la clase ProductMediaDto en cuestión

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
  constructor(partial: Partial<ProductMediaDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductMediaDto>): ProductMediaDto {
    const instance = new ProductMediaDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductMediaValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductMediaDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductMediaDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductMediaOutPutDto extends BaseProductMediaDto {
  // Propiedades específicas de la clase ProductMediaOutPutDto en cuestión

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
  constructor(partial: Partial<ProductMediaOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductMediaOutPutDto>): ProductMediaOutPutDto {
    const instance = new ProductMediaOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductMediaDto extends BaseProductMediaDto {
  // Propiedades específicas de la clase CreateProductMediaDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProductMedia a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductMediaDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductMediaDto>): CreateProductMediaDto {
    const instance = new CreateProductMediaDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductMediaDto {
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
    type: () => CreateProductMediaDto,
    description: 'Instancia CreateProductMedia o UpdateProductMedia',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductMediaDto, { nullable: true })
  input?: CreateProductMediaDto | UpdateProductMediaDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductMediaDto {
  // Propiedades específicas de la clase DeleteProductMediaDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProductMedia a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProductMedia a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductMediaDto extends BaseProductMediaDto {
  // Propiedades específicas de la clase UpdateProductMediaDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProductMedia a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductMediaDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductMediaDto>): UpdateProductMediaDto {
    const instance = new UpdateProductMediaDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

