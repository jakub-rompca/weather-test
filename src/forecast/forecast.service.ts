import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ForecastEntity } from './db/forecast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEnum } from './enum/location.enum';
import { TimeEnum } from './enum/time.enum';
import { WeatherApiService } from '../weather-api/weather-api.service';

@Injectable()
export class ForecastService {
  constructor(
    @InjectRepository(ForecastEntity)
    private readonly forecastRepository: Repository<ForecastEntity>,
    private readonly weatherApiService: WeatherApiService,
  ) {}

  public async getByLocationAndTime(
    location: LocationEnum,
    time: TimeEnum,
  ): Promise<ForecastEntity> {
    const currentDbData = await this.forecastRepository.findOne({
      where: {
        location,
        time,
      },
      order: { createdAt: 'DESC' },
    });
    if (
      !currentDbData ||
      (currentDbData && this.isDataStale(currentDbData.createdAt))
    ) {
      return await this.updateAndReturnData(location, time);
    }
    return currentDbData;
  }

  private async updateAndReturnData(
    location: LocationEnum,
    time: TimeEnum,
  ): Promise<ForecastEntity> {
    const { cloudCover, temperature, windSpeed } =
      await this.weatherApiService.fetchByLocationAndTime(location, time);

    return await this.forecastRepository.save({
      location,
      time,
      cloudCover,
      temperature,
      windSpeed,
    });
  }

  private isDataStale(dateFromData: Date): boolean {
    const timeNow = new Date();
    return this.getDateHash(timeNow) !== this.getDateHash(dateFromData);
  }

  private getDateHash(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
  }
}
