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
export class BaseProductAttributeDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProductAttribute',
    example: 'Nombre de instancia CreateProductAttribute',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductAttributeDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProductAttribute).',
    example: 'Fecha de creación de la instancia (CreateProductAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProductAttribute).',
    example: 'Fecha de actualización de la instancia (CreateProductAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProductAttribute).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProductAttribute).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProductAttribute).',
    example: 'Estado de activación de la instancia (CreateProductAttribute).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Grupo lógico del atributo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Grupo lógico del atributo', nullable: true })
  groupCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del atributo', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible', nullable: false })
  displayName!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo del atributo', nullable: false })
  dataType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ámbito de aplicación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ámbito de aplicación', nullable: false })
  appliesTo!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica obligatoriedad',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica obligatoriedad', nullable: false })
  isRequired!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Participa en filtros',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Participa en filtros', nullable: false })
  isFilterable!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Participa en búsqueda',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Participa en búsqueda', nullable: false })
  isSearchable!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Específico de variante',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Específico de variante', nullable: false })
  isVariantSpecific!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Opciones para enum',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Opciones para enum', nullable: true })
  enumOptions?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de entidad objetivo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de entidad objetivo', nullable: false })
  targetEntityType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Entidad portadora del valor',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Entidad portadora del valor', nullable: true })
  targetEntityId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor string',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor string', nullable: true })
  stringValue?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor numérico',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor numérico', nullable: true })
  numericValue?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Valor booleano',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Valor booleano', nullable: true })
  booleanValue?: boolean = false;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor enum seleccionado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor enum seleccionado', nullable: true })
  enumValue?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del atributo o valor',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos del atributo o valor', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductAttributeDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductAttributeDto extends BaseProductAttributeDto {
  // Propiedades específicas de la clase ProductAttributeDto en cuestión

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
  constructor(partial: Partial<ProductAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductAttributeDto>): ProductAttributeDto {
    const instance = new ProductAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductAttributeValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductAttributeDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductAttributeDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductAttributeOutPutDto extends BaseProductAttributeDto {
  // Propiedades específicas de la clase ProductAttributeOutPutDto en cuestión

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
  constructor(partial: Partial<ProductAttributeOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductAttributeOutPutDto>): ProductAttributeOutPutDto {
    const instance = new ProductAttributeOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductAttributeDto extends BaseProductAttributeDto {
  // Propiedades específicas de la clase CreateProductAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProductAttribute a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductAttributeDto>): CreateProductAttributeDto {
    const instance = new CreateProductAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductAttributeDto {
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
    type: () => CreateProductAttributeDto,
    description: 'Instancia CreateProductAttribute o UpdateProductAttribute',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductAttributeDto, { nullable: true })
  input?: CreateProductAttributeDto | UpdateProductAttributeDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductAttributeDto {
  // Propiedades específicas de la clase DeleteProductAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProductAttribute a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProductAttribute a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductAttributeDto extends BaseProductAttributeDto {
  // Propiedades específicas de la clase UpdateProductAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProductAttribute a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductAttributeDto>): UpdateProductAttributeDto {
    const instance = new UpdateProductAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

