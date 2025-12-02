import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entity/user.entity';
import { UserVerification } from './entity/user-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserVerification])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
