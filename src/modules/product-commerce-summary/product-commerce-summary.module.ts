import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductCommerceSummaryController } from './product-commerce-summary.controller';
import { ProductCommerceSummaryService } from './product-commerce-summary.service';

@Module({
  imports: [ConfigModule],
  controllers: [ProductCommerceSummaryController],
  providers: [ProductCommerceSummaryService],
  exports: [ProductCommerceSummaryService],
})
export class ProductCommerceSummaryModule {}