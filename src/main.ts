import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { appBootstrap } from './common';
import { AppConfig } from './config';

async function init(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService<AppConfig>>(ConfigService);

  appBootstrap(app, {
    validationPipeOptions: {
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    },
  });

  await app.listen(configService.get('port', { infer: true }));
}

init();
