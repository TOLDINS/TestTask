import { Module } from '@nestjs/common';

import { RecordOrderAnalyticsService } from './services';

@Module({
  providers: [RecordOrderAnalyticsService],
})
export class AnalyticsModule {}
