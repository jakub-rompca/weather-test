import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserResolver],
})
export class UserModule {}
