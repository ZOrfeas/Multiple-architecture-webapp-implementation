import { IsNotEmpty, IsString, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectWithId } from 'src/validation-utils';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  readonly ansContent: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ObjectWithId)
  readonly user: ObjectWithId;

  @IsDefined()
  @ValidateNested()
  @Type(() => ObjectWithId)
  readonly question: ObjectWithId;
}
