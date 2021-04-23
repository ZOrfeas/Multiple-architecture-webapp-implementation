import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // This enables UserRepository injection in the Service
  exports: [TypeOrmModule], // With this, a module can import UserModule and be able to use UserRepository by injection
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
