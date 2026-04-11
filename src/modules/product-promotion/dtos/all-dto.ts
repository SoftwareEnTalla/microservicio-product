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
export class BaseProductPromotionDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProductPromotion',
    example: 'Nombre de instancia CreateProductPromotion',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProductPromotionDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProductPromotion).',
    example: 'Fecha de creación de la instancia (CreateProductPromotion).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProductPromotion).',
    example: 'Fecha de actualización de la instancia (CreateProductPromotion).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProductPromotion).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProductPromotion).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProductPromotion).',
    example: 'Estado de activación de la instancia (CreateProductPromotion).',
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
    description: 'Tipo de promoción',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de promoción', nullable: false })
  promotionType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código promocional o interno',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código promocional o interno', nullable: true })
  code?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de evaluación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de evaluación', nullable: false })
  priority!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Puede acumularse',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Puede acumularse', nullable: false })
  stackable!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Descuento porcentual',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Descuento porcentual', nullable: true })
  discountPercent?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Descuento fijo',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Descuento fijo', nullable: true })
  discountAmount?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Precio especial',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Precio especial', nullable: true })
  specialPrice?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cupón asociado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Cupón asociado', nullable: true })
  couponCode?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Cantidad mínima para promoción por volumen',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Cantidad mínima para promoción por volumen', nullable: true })
  minQuantity?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Segmento objetivo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Segmento objetivo', nullable: true })
  segment?: string = '';

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
    description: 'Estado de la promoción',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la promoción', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de la promoción',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos de la promoción', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseProductPromotionDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProductPromotionDto extends BaseProductPromotionDto {
  // Propiedades específicas de la clase ProductPromotionDto en cuestión

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
  constructor(partial: Partial<ProductPromotionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductPromotionDto>): ProductPromotionDto {
    const instance = new ProductPromotionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProductPromotionValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProductPromotionDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProductPromotionDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProductPromotionOutPutDto extends BaseProductPromotionDto {
  // Propiedades específicas de la clase ProductPromotionOutPutDto en cuestión

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
  constructor(partial: Partial<ProductPromotionOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProductPromotionOutPutDto>): ProductPromotionOutPutDto {
    const instance = new ProductPromotionOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProductPromotionDto extends BaseProductPromotionDto {
  // Propiedades específicas de la clase CreateProductPromotionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProductPromotion a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProductPromotionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProductPromotionDto>): CreateProductPromotionDto {
    const instance = new CreateProductPromotionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProductPromotionDto {
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
    type: () => CreateProductPromotionDto,
    description: 'Instancia CreateProductPromotion o UpdateProductPromotion',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProductPromotionDto, { nullable: true })
  input?: CreateProductPromotionDto | UpdateProductPromotionDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProductPromotionDto {
  // Propiedades específicas de la clase DeleteProductPromotionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProductPromotion a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProductPromotion a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProductPromotionDto extends BaseProductPromotionDto {
  // Propiedades específicas de la clase UpdateProductPromotionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProductPromotion a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProductPromotionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProductPromotionDto>): UpdateProductPromotionDto {
    const instance = new UpdateProductPromotionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

