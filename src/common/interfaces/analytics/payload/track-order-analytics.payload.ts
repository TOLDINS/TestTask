import { AnalyticsOrderAttributes } from '../attributes/analytics-order.attributes.interface';

import { BasicAnalyticsPayload } from './basic-analytics.payload';

export interface TrackOrderAnalyticsPayload
  extends BasicAnalyticsPayload<AnalyticsOrderAttributes> {}
