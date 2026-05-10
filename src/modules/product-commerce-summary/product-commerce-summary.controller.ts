import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProductCommerceSummaryService } from './product-commerce-summary.service';

@ApiTags('product-commerce-summary')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('product-commerce-summary')
export class ProductCommerceSummaryController {
  constructor(private readonly service: ProductCommerceSummaryService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Resumen comercial agregado de Product' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen comercial de Product.' })
  async getOverview(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getOverview(Number(limit || 6));
  }
}