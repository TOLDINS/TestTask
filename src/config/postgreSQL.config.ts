import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import { AppEnv } from '.';

export default registerAs(
  'PSQL_DB',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.PSQL_HOST || 'localhost',
    port: +process.env.PSQL_PORT || 5432,
    username: process.env.PSQL_USER || 'postgres',
    password: process.env.PSQL_PASSWORD || '1111',
    database: process.env.PSQL_DATABASE || 'postgres',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsRun: [AppEnv.Prod, AppEnv.Stage].includes(
      process.env.NODE_ENV as AppEnv | AppEnv.Prod,
    ),
    synchronize: false,
    logging: process.env.NODE_ENV === AppEnv.Dev,
  }),
);
