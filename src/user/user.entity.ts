import { Column, Entity } from 'typeorm';
import { BasicEntity } from '../database/basic.entity';

@Entity()
export class UserEntity extends BasicEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
