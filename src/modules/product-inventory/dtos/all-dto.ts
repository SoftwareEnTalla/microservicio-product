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
export class BaseProductInventoryDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProductInventory',
    example: 'Nombre de instancia CreateProductInventory',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductInventoryDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProductInventory).',
    example: 'Fecha de creación de la instancia (CreateProductInventory).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProductInventory).',
    example: 'Fecha de actualización de la instancia (CreateProductInventory).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProductInventory).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProductInventory).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProductInventory).',
    example: 'Estado de activación de la instancia (CreateProductInventory).',
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
    nullable: true,
    description: 'Almacén o ubicación',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Almacén o ubicación', nullable: true })
  warehouseId?: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Stock disponible',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Stock disponible', nullable: false })
  availableStock!: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Stock reservado',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Stock reservado', nullable: false })
  reservedStock!: number;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Stock entrante',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Stock entrante', nullable: true })
  incomingStock?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Punto de reposición',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Punto de reposición', nullable: true })
  reorderPoint?: number = 0;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Permite backorder',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Permite backorder', nullable: false })
  backorderAllowed!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de disponibilidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de disponibilidad', nullable: false })
  stockStatus!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de inventario',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos de inventario', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductInventoryDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductInventoryDto extends BaseProductInventoryDto {
  // Propiedades específicas de la clase ProductInventoryDto en cuestión

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
  constructor(partial: Partial<ProductInventoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductInventoryDto>): ProductInventoryDto {
    const instance = new ProductInventoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductInventoryValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductInventoryDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductInventoryDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductInventoryOutPutDto extends BaseProductInventoryDto {
  // Propiedades específicas de la clase ProductInventoryOutPutDto en cuestión

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
  constructor(partial: Partial<ProductInventoryOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductInventoryOutPutDto>): ProductInventoryOutPutDto {
    const instance = new ProductInventoryOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductInventoryDto extends BaseProductInventoryDto {
  // Propiedades específicas de la clase CreateProductInventoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProductInventory a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductInventoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductInventoryDto>): CreateProductInventoryDto {
    const instance = new CreateProductInventoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductInventoryDto {
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
    type: () => CreateProductInventoryDto,
    description: 'Instancia CreateProductInventory o UpdateProductInventory',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductInventoryDto, { nullable: true })
  input?: CreateProductInventoryDto | UpdateProductInventoryDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductInventoryDto {
  // Propiedades específicas de la clase DeleteProductInventoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProductInventory a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProductInventory a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductInventoryDto extends BaseProductInventoryDto {
  // Propiedades específicas de la clase UpdateProductInventoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProductInventory a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductInventoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductInventoryDto>): UpdateProductInventoryDto {
    const instance = new UpdateProductInventoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

