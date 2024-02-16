import { Column, Entity } from 'typeorm';
import { BasicEntity } from '../database/basic.entity';

@Entity()
export class UserEntity extends BasicEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  // TODO security
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
