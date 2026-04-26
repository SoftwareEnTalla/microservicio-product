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

import { Query, Resolver, Args } from '@nestjs/graphql'; 
import { PromotionTypeDto } from '../dtos/all-dto';
import { PromotionTypeGraphqlService } from '../services/promotiontype.graphql.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => PromotionTypeDto)
export class PromotionTypeGraphqlQuery {
  constructor(private readonly service: PromotionTypeGraphqlService) {}

  @Query(() => [PromotionTypeDto], { name: 'findAllPromotionTypes' })
  async findAll(): Promise<PromotionTypeDto[]> {
    return this.service.findAll();
  }

  @Query(() => PromotionTypeDto, { name: 'findPromotionTypeById' })
  async findById(
    @Args('id', { type: () => String }) id: string
  ): Promise<PromotionTypeDto> {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException("PromotionType con id " + id + " no encontrado");
    }
    return result;
  }
}
