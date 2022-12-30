import { AnalyticsSubjectTypes } from '@common/enums';

export interface BasicAnalyticsPayload<T> {
  userId: number;
  actionSubjectType: AnalyticsSubjectTypes;
  attributes: T;
}
