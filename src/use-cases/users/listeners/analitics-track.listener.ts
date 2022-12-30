import { AnalyticsRecord } from '@common/entities/analytics-record.entity';
import { Events } from '@common/enums';
import { TrackOrderAnalyticsPayload } from '@common/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';

@Injectable()
export class TrackAnaliticsListener {
  private logger = new Logger(TrackAnaliticsListener.name);
  constructor(private readonly dataSource: DataSource) {}

  @OnEvent(Events.TrackOrderTariffAnalytics, { promisify: true })
  async handleTrackAnalitics(
    payload: TrackOrderAnalyticsPayload,
  ): Promise<void> {
    try {
      await this.dataSource
        .getRepository(AnalyticsRecord)
        .insert({ ...payload });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
