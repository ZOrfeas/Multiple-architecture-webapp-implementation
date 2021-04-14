import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, // Port at which the Database is exposed
      username: 'soa-data-user', // The name of the user/owner of the Database
      password: 'secret-pass', // Their password
      database: 'ama-soa-data', // The name of the database
      entities: [User],
      synchronize: true, // Pretty sure this enforces database creation every time at startup
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
