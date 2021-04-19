import { IsNotEmpty, IsOptional, IsDefined, ValidateNested, IsArray, IsString,  } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectWithId } from '../../validation-utils';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly questContent: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ObjectWithId)
  readonly user: ObjectWithId;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjectWithId)
  keywords?: ObjectWithId[];
}
