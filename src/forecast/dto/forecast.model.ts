import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForecastModel {
  @Field(() => Int)
  id: number;
}
