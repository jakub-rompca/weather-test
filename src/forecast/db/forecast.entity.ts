import { Column, Entity } from 'typeorm';
import { BasicEntity } from '../../database/basic.entity';
import { LocationEnum } from '../enum/location.enum';
import { TimeEnum } from '../enum/time.enum';

@Entity()
export class ForecastEntity extends BasicEntity {
  @Column({ type: 'enum', enum: LocationEnum })
  location: LocationEnum;

  @Column({ type: 'enum', enum: TimeEnum })
  time: TimeEnum;

  @Column({ type: 'double' })
  cloudCover: number;

  @Column({ type: 'double' })
  temperature: number;

  @Column({ type: 'double' })
  windSpeed: number;
}
