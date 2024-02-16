import {
  Field,
  Float,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { LocationEnum } from '../enum/location.enum';
import { TimeEnum } from '../enum/time.enum';
import { Column } from 'typeorm';

@ObjectType()
export class ForecastModel {
  @Field(() => Int)
  id: number;

  @Field(() => LocationEnum)
  location: LocationEnum;

  @Field(() => TimeEnum)
  time: TimeEnum;

  @Field(() => Float)
  cloudCover: number;

  @Field(() => Float)
  temperature: number;

  @Field(() => Float)
  windSpeed: number;
}

registerEnumType(LocationEnum, {
  name: 'Location',
});

registerEnumType(TimeEnum, {
  name: 'Time',
});
