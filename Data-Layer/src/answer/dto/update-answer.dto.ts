import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAnswerDto } from './create-answer.dto';

export class UpdateAnswerDto extends PartialType(
  OmitType(CreateAnswerDto, ['question', 'user', 'answeredOn'] as const), // can't change an answers target question
) {}
