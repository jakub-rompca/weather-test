import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocationEnum } from '../forecast/enum/location.enum';
import {
  PreciseLocation,
  PreciseTime,
  WeatherApiData,
  WeatherApiDayResponse,
  WeatherApiHourResponse,
  WeatherApiResponse,
} from './weather-api.type';
import { HttpService } from '@nestjs/axios';
import { TimeEnum } from '../forecast/enum/time.enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherApiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public async fetchByLocationAndTime(
    location: LocationEnum,
    time: TimeEnum,
  ): Promise<WeatherApiData> {
    const mappedLocation = this.locationEnumToApiMapper(location);
    const mappedTime = this.timeEnumToApiMapper(time);
    const apiUrl = this.configService.get<string>('WEATHERAPI_URL');

    // TODO error handling
    const { data } = await firstValueFrom(
      this.httpService
        .get<WeatherApiResponse>(
          `${apiUrl}?q=${mappedLocation.latitude},${mappedLocation.longitude}&days=1&dt=${mappedTime.date}&hour=${mappedTime.hour}&key=${this.configService.get<string>('WEATHERAPI_API_KEY')}`,
        )
        .pipe(),
    );
    const preciseDayData: WeatherApiDayResponse =
      data.forecast.forecastday.find((day) => day.date === mappedTime.date);

    const preciseHourData: WeatherApiHourResponse = preciseDayData.hour.find(
      (hour) => hour.time === `${mappedTime.date} ${mappedTime.hour}:00`,
    );

    return {
      cloudCover: preciseHourData.cloud,
      temperature: preciseHourData.temp_c,
      windSpeed: preciseHourData.wind_kph,
    };
  }

  private locationEnumToApiMapper(location: LocationEnum): PreciseLocation {
    const mapper: Record<LocationEnum, PreciseLocation> = {
      [LocationEnum.GDANSK]: { latitude: 54.35, longitude: 18.67 },
      [LocationEnum.MELBOURNE]: { latitude: -37.82, longitude: 144.97 },
      [LocationEnum.REYKJAVIK]: { latitude: 64.15, longitude: -21.95 },
      [LocationEnum.WARSAW]: { latitude: 52.25, longitude: 21 },
    };
    return mapper[location];
  }

  private timeEnumToApiMapper(time: TimeEnum): PreciseTime {
    const timeNow = new Date();
    timeNow.setMinutes(0, 0, 0);

    const timeSixHours = new Date(timeNow);
    timeSixHours.setHours(timeNow.getHours() + 6);

    const timeTommorow = new Date(timeNow);
    timeTommorow.setDate(timeNow.getDate() + 1);

    const mapper: Record<TimeEnum, PreciseTime> = {
      [TimeEnum.NOW]: {
        date: this.dateObjectToDateString(timeNow),
        hour: timeNow.getHours(),
      },
      [TimeEnum.SIX_HOURS]: {
        date: this.dateObjectToDateString(timeSixHours),
        hour: timeNow.getHours(),
      },
      [TimeEnum.TOMMOROW]: {
        date: this.dateObjectToDateString(timeTommorow),
        hour: timeNow.getHours(),
      },
    };
    return mapper[time];
  }

  private dateObjectToDateString(date: Date): string {
    const formattedMonth =
      date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    return `${date.getFullYear()}-${formattedMonth}-${date.getDate()}`;
  }
}
