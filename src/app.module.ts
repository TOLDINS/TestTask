import { AppResponseInterceptor } from '@common/interceptors';
import { RepositoryModule } from '@common/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config/app.config';
import psqlConfiguration from './config/postgreSQL.config';
import { AnalyticsModule } from './use-cases/analytics/analytics.module';
import { OrdersModule } from './use-cases/payment-orders/orders.module';
import { UsersModule } from './use-cases/users/users.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, psqlConfiguration],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('PSQL_DB'),
      }),
    }),
    RepositoryModule,
    OrdersModule,
    UsersModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppResponseInterceptor,
    },
  ],
})
export class AppModule {}
