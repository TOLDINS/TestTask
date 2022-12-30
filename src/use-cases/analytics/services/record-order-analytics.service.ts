import { Events } from '@common/enums';
import { TrackOrderAnalyticsPayload } from '@common/interfaces';
import { AnalyticsRecordRepository } from '@common/modules';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RecordOrderAnalyticsService {
  private logger = new Logger(RecordOrderAnalyticsService.name);
  constructor(
    private readonly analyticsRepository: AnalyticsRecordRepository,
  ) {}

  @OnEvent(Events.TrackOrderTariffAnalytics, { promisify: true })
  async handleTrackOrderAnalytics(
    payload: TrackOrderAnalyticsPayload,
  ): Promise<void> {
    try {
      await this.analyticsRepository.save({ ...payload });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
