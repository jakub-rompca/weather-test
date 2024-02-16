import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { config as dotenvConfig } from 'dotenv';
import { SnakeCaseStrategy } from './strategies/snake-case.strategy';

export class DatabaseConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // To simplify DB config - NestJS Config Module is not injected here, instead basic dotenv package is used
    const basePath = resolve(join(__dirname, '..', '..'));
    dotenvConfig({ path: basePath + '/.env' });

    return {
      type: 'mysql',
      host: `${process.env.DATABASE_HOST}`,
      port: Number(`${process.env.DATABASE_PORT}`),
      username: `${process.env.DATABASE_USERNAME}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: `${process.env.DATABASE_NAME}`,
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new SnakeCaseStrategy(),
      timezone: 'Z',
    };
  }
}
