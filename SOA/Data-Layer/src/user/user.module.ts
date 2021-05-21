import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getCustomLogger } from 'src/logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // This enables UserRepository injection in the Service
  exports: [TypeOrmModule], // With this, a module can import UserModule and be able to use UserRepository by injection
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(getCustomLogger(UserController.name))
      .forRoutes(UserController);
  }
}
