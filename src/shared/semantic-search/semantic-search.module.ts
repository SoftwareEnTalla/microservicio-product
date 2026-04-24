import { Global, Module } from '@nestjs/common';
import { SemanticSearchService } from './semantic-search.service';

@Global()
@Module({
  providers: [SemanticSearchService],
  exports: [SemanticSearchService],
})
export class SemanticSearchModule {}
