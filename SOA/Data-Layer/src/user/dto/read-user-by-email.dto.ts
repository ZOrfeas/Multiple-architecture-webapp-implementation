import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserByEmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
