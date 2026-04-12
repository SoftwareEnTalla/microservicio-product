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
export class BaseProductSpecificationDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProductSpecification',
    example: 'Nombre de instancia CreateProductSpecification',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductSpecificationDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProductSpecification).',
    example: 'Fecha de creación de la instancia (CreateProductSpecification).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProductSpecification).',
    example: 'Fecha de actualización de la instancia (CreateProductSpecification).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProductSpecification).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProductSpecification).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProductSpecification).',
    example: 'Estado de activación de la instancia (CreateProductSpecification).',
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
    description: 'Grupo visual de especificaciones',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Grupo visual de especificaciones', nullable: false })
  groupName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código del grupo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código del grupo', nullable: true })
  groupCode?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden visual',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden visual', nullable: false })
  position!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave interna',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave interna', nullable: false })
  specKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etiqueta visible',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etiqueta visible', nullable: false })
  label!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Valor visible',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Valor visible', nullable: false })
  value!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de valor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de valor', nullable: false })
  valueType!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Determina si se muestra en ficha',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Determina si se muestra en ficha', nullable: false })
  isVisible!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la especificación',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de la especificación', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductSpecificationDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductSpecificationDto extends BaseProductSpecificationDto {
  // Propiedades específicas de la clase ProductSpecificationDto en cuestión

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
  constructor(partial: Partial<ProductSpecificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductSpecificationDto>): ProductSpecificationDto {
    const instance = new ProductSpecificationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductSpecificationValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductSpecificationDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductSpecificationDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductSpecificationOutPutDto extends BaseProductSpecificationDto {
  // Propiedades específicas de la clase ProductSpecificationOutPutDto en cuestión

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
  constructor(partial: Partial<ProductSpecificationOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductSpecificationOutPutDto>): ProductSpecificationOutPutDto {
    const instance = new ProductSpecificationOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductSpecificationDto extends BaseProductSpecificationDto {
  // Propiedades específicas de la clase CreateProductSpecificationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProductSpecification a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductSpecificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductSpecificationDto>): CreateProductSpecificationDto {
    const instance = new CreateProductSpecificationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductSpecificationDto {
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
    type: () => CreateProductSpecificationDto,
    description: 'Instancia CreateProductSpecification o UpdateProductSpecification',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductSpecificationDto, { nullable: true })
  input?: CreateProductSpecificationDto | UpdateProductSpecificationDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductSpecificationDto {
  // Propiedades específicas de la clase DeleteProductSpecificationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProductSpecification a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProductSpecification a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductSpecificationDto extends BaseProductSpecificationDto {
  // Propiedades específicas de la clase UpdateProductSpecificationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProductSpecification a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductSpecificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductSpecificationDto>): UpdateProductSpecificationDto {
    const instance = new UpdateProductSpecificationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

