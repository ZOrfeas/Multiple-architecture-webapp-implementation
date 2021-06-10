import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { User } from '../user/entities/user.entity';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class AnswerService {
  private readonly logger = new Logger(AnswerService.name);

  constructor(
    @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    return this.manager.transaction(async (manager) => {
      const userId = createAnswerDto.user.id;
      const qId = createAnswerDto.question.id;
      const existingUser = await manager.findOne(User, userId);
      if (!existingUser)
        throw new NotFoundException(`User with id ${userId} was not found`);
      // this.logger.error('kalispera');
      const existingQuestion = await manager.findOne(Question, qId);
      if (!existingQuestion)
        throw new NotFoundException(`Question with id ${qId} was not found`);
      const newAnswer = manager.create(Answer, createAnswerDto);
      return manager.save(newAnswer);
    });
  }

  findAll(): Promise<Answer[]> {
    return this.answerRepository.find();
  }

  findOne(id: number): Promise<Answer> {
    return this.answerRepository.findOne(id, {
      relations: ['user', 'question'],
    });
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto): Promise<Answer> {
    return this.manager.transaction(async (manager) => {
      const existingAnswer = await manager.findOne(Answer, id);
      if (!existingAnswer)
        throw new NotFoundException(`Answer with id ${id} was not found`);
      manager.merge(Answer, existingAnswer, updateAnswerDto);
      return manager.save(existingAnswer);
    });
  }

  remove(id: number): Promise<void> {
    return this.manager.transaction(async (manager) => {
      const existingAnswer = await manager.findOne(Answer, id);
      if (!existingAnswer)
        throw new NotFoundException(`Answer with id ${id} was not found`);
      await manager.delete(Answer, id);
    });
  }

  count(): Promise<number> {
    return this.answerRepository.count();
  }

  countByYear(year: number): Promise<any> {
    const fromDate = year.toString() + '-01-01';
    const toDate = (year + 1).toString() + '-01-01';
    const queryString = `SELECT COUNT(*) as count, date_trunc('day', "answeredOn") as day
      FROM "answer" WHERE "answeredOn">='${fromDate}' AND "answeredOn"<'${toDate}'
      GROUP BY day`;
    return this.manager.query(queryString);
  }
}
