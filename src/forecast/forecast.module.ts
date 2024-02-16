import { Module } from '@nestjs/common';
import { ForecastResolver } from './forecast.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForecastEntity } from './db/forecast.entity';
import { ForecastService } from './forecast.service';
import { WeatherApiModule } from '../weather-api/weather-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([ForecastEntity]), WeatherApiModule],
  providers: [ForecastResolver, ForecastService],
})
export class ForecastModule {}
