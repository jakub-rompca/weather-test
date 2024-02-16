import { Module } from '@nestjs/common';
import { ForecastResolver } from './forecast.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForecastEntity } from './db/forecast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForecastEntity])],
  providers: [ForecastResolver],
})
export class ForecastModule {}
