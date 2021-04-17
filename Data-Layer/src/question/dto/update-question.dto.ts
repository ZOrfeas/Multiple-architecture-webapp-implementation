import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(
  OmitType(CreateQuestionDto, ['user', 'askedOn'] as const), // can't change a question's "owner"
) {}
