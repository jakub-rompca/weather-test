import { Args, Query, Resolver } from '@nestjs/graphql';
import { ForecastModel } from './dto/forecast.model';
import { ForecastService } from './forecast.service';
import { LocationEnum } from './enum/location.enum';
import { TimeEnum } from './enum/time.enum';

@Resolver(() => ForecastModel)
export class ForecastResolver {
  constructor(private readonly forecastService: ForecastService) {}

  @Query(() => [ForecastModel])
  public async getAllForecast(): Promise<ForecastModel[]> {
    return await this.forecastService.getAll();
  }

  // TODO union error handling?
  @Query(() => ForecastModel)
  public async getForecast(
    @Args('location', { type: () => LocationEnum }) location: LocationEnum,
    @Args('time', { type: () => TimeEnum }) time: TimeEnum,
  ): Promise<ForecastModel> {
    // TODO generic error handling
    return await this.forecastService.getByLocationAndTime(location, time);
  }
}
