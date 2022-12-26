import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config/index';
import psqlConfiguration from './config/postgreSQL.config';
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
    UsersModule,
  ],
})
export class AppModule {}
