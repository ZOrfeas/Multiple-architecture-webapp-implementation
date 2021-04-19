import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(
  OmitType(CreateQuestionDto, ['user'] as const), // can't change a question's "owner"
) {}
