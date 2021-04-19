import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectWithId } from 'src/validation-utils';

export class CreateKeywordDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ObjectWithId)
  readonly user?: ObjectWithId;
}
