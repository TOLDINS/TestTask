import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import configuration from './src/config/postgreSQL.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
});

export default new DataSource(configuration());
