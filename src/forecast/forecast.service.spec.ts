import { Test, TestingModule } from '@nestjs/testing';
import { ForecastService } from './forecast.service';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { WeatherApiData } from '../weather-api/weather-api.type';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForecastEntity } from './db/forecast.entity';
import { LocationEnum } from './enum/location.enum';
import { Repository } from 'typeorm';
import { TimeEnum } from './enum/time.enum';
import { createMock } from '@golevelup/ts-jest';
import { WeatherApiModule } from '../weather-api/weather-api.module';

describe('ForecastService', () => {
  let service: ForecastService;
  let repository: Repository<ForecastEntity>;
  let weatherApi: WeatherApiService;

  const prepareForecastEntitySample = (
    entity: Partial<ForecastEntity>,
  ): ForecastEntity => {
    return {
      id: entity.id ? entity.id : faker.number.int(),
      location: entity.location ? entity.location : LocationEnum.MELBOURNE,
      time: entity.time ? entity.time : TimeEnum.NOW,
      createdAt: entity.createdAt ? entity.createdAt : faker.date.recent(),
      cloudCover: entity.cloudCover
        ? entity.cloudCover
        : prepareWeatherApiSampleData().cloudCover,
      temperature: entity.temperature
        ? entity.temperature
        : prepareWeatherApiSampleData().temperature,
      windSpeed: entity.windSpeed
        ? entity.windSpeed
        : prepareWeatherApiSampleData().windSpeed,
    };
  };

  const prepareWeatherApiSampleData = (): WeatherApiData => {
    return {
      cloudCover: faker.number.float({ max: 100.0, fractionDigits: 2 }),
      temperature: faker.number.float({ min: -20, max: 40, fractionDigits: 2 }),
      windSpeed: faker.number.float({ max: 200, fractionDigits: 2 }),
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForecastService,
        {
          provide: getRepositoryToken(ForecastEntity),
          useValue: { findOne: jest.fn(), save: jest.fn(), find: jest.fn() },
        },
      ],
      imports: [WeatherApiModule],
    }).compile();

    service = module.get<ForecastService>(ForecastService);
    repository = module.get<Repository<ForecastEntity>>(
      getRepositoryToken(ForecastEntity),
    );
    weatherApi = module.get<WeatherApiService>(WeatherApiService);
  });

  it('should not call weather api if data is valid', async () => {
    // GIVEN
    const testTime = new Date('2024-02-16 15:30:00');
    const testLocationEnum = LocationEnum.MELBOURNE;
    const testTimeEnum = TimeEnum.NOW;
    jest.useFakeTimers().setSystemTime(testTime);
    const mockForecast = prepareForecastEntitySample({
      time: testTimeEnum,
      location: testLocationEnum,
      createdAt: testTime,
    });
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockForecast);
    const apiSpy = jest.spyOn(weatherApi, 'fetchByLocationAndTime');

    // WHEN
    await service.getByLocationAndTime(testLocationEnum, testTimeEnum);

    // THEN
    expect(apiSpy).not.toHaveBeenCalled();
  });

  it('should call weather api if data is stale', async () => {
    // GIVEN
    const testTime = new Date('2024-02-16 15:30:00');
    const testLocationEnum = LocationEnum.MELBOURNE;
    const testTimeEnum = TimeEnum.NOW;
    const mockServerTime = new Date('2024-02-16 16:30:00');
    jest.useFakeTimers().setSystemTime(mockServerTime);
    const mockForecast = prepareForecastEntitySample({
      time: testTimeEnum,
      location: testLocationEnum,
      createdAt: testTime,
    });
    const findOneSpy = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(mockForecast);
    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue({
      ...mockForecast,
      createdAt: mockServerTime,
    });
    const apiSpy = jest
      .spyOn(weatherApi, 'fetchByLocationAndTime')
      .mockResolvedValue(prepareWeatherApiSampleData());

    // WHEN
    await service.getByLocationAndTime(testLocationEnum, testTimeEnum);

    // THEN
    expect(findOneSpy).toHaveBeenCalled();
    expect(apiSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
  });
});
