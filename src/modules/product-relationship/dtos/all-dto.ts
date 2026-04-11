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
export class BaseProductRelationshipDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProductRelationship',
    example: 'Nombre de instancia CreateProductRelationship',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductRelationshipDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProductRelationship).',
    example: 'Fecha de creación de la instancia (CreateProductRelationship).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProductRelationship).',
    example: 'Fecha de actualización de la instancia (CreateProductRelationship).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProductRelationship).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProductRelationship).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProductRelationship).',
    example: 'Estado de activación de la instancia (CreateProductRelationship).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto origen',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto origen', nullable: false })
  sourceProductId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Producto relacionado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Producto relacionado', nullable: false })
  targetProductId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de relación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de relación', nullable: false })
  relationshipType!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de recomendación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de recomendación', nullable: false })
  priority!: number;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Inicio de vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Inicio de vigencia', nullable: true })
  validFrom?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fin de vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fin de vigencia', nullable: true })
  validTo?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la relación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la relación', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la relación',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos de la relación', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductRelationshipDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductRelationshipDto extends BaseProductRelationshipDto {
  // Propiedades específicas de la clase ProductRelationshipDto en cuestión

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
  constructor(partial: Partial<ProductRelationshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductRelationshipDto>): ProductRelationshipDto {
    const instance = new ProductRelationshipDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductRelationshipValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductRelationshipDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductRelationshipDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductRelationshipOutPutDto extends BaseProductRelationshipDto {
  // Propiedades específicas de la clase ProductRelationshipOutPutDto en cuestión

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
  constructor(partial: Partial<ProductRelationshipOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductRelationshipOutPutDto>): ProductRelationshipOutPutDto {
    const instance = new ProductRelationshipOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductRelationshipDto extends BaseProductRelationshipDto {
  // Propiedades específicas de la clase CreateProductRelationshipDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProductRelationship a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductRelationshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductRelationshipDto>): CreateProductRelationshipDto {
    const instance = new CreateProductRelationshipDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductRelationshipDto {
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
    type: () => CreateProductRelationshipDto,
    description: 'Instancia CreateProductRelationship o UpdateProductRelationship',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductRelationshipDto, { nullable: true })
  input?: CreateProductRelationshipDto | UpdateProductRelationshipDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductRelationshipDto {
  // Propiedades específicas de la clase DeleteProductRelationshipDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProductRelationship a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProductRelationship a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductRelationshipDto extends BaseProductRelationshipDto {
  // Propiedades específicas de la clase UpdateProductRelationshipDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProductRelationship a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductRelationshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductRelationshipDto>): UpdateProductRelationshipDto {
    const instance = new UpdateProductRelationshipDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

