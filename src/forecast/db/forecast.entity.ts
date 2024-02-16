import { Entity } from 'typeorm';
import { BasicEntity } from '../../database/basic.entity';

@Entity()
export class ForecastEntity extends BasicEntity {}
