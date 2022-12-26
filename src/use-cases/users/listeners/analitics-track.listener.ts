import { PaymentAnalitics } from '@common/entities';
import { Events } from '@common/enums';
import { TrackAnaliticsPayload } from '@common/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';

@Injectable()
export class TrackAnaliticsListener {
  private logger = new Logger(TrackAnaliticsListener.name);
  constructor(private readonly dataSource: DataSource) {}

  @OnEvent(Events.RecordAnalitycs, { promisify: true })
  async handleTrackAnalitics(payload: TrackAnaliticsPayload): Promise<void> {
    try {
      await this.dataSource
        .getRepository(PaymentAnalitics)
        .insert({ ...payload });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
