import { Test, TestingModule } from '@nestjs/testing';
import { ForecastResolver } from './forecast.resolver';

describe('ForecastResolver', () => {
  let resolver: ForecastResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForecastResolver],
    }).compile();

    resolver = module.get<ForecastResolver>(ForecastResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
