import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BasicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date = new Date();
}
