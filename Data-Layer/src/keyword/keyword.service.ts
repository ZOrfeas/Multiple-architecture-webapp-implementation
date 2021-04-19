import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class KeywordService {
  private readonly logger = new Logger(KeywordService.name);

  constructor(
    @InjectRepository(Keyword) private readonly keywordRepository: Repository<Keyword>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    if (!createKeywordDto.user) {
      const newKeyword = this.keywordRepository.create(createKeywordDto);
      return this.keywordRepository.save(newKeyword);
    } else {
      return this.manager.transaction(async (manager) => {
        const userId = createKeywordDto.user.id;
        const existingUser = await manager.findOne(User, userId);
        if (!existingUser)
          throw new NotFoundException(`User with id ${userId} was not found`);
        const newKeyword = manager.create(Keyword, createKeywordDto);
        return manager.save(newKeyword);
      });
    }
  }

  findAll(): Promise<Keyword[]> {
    return this.keywordRepository.find();
  }

  findOne(id: number): Promise<Keyword> {
    return this.keywordRepository.findOne(id, { relations: ['user'] });
  }

  update(id: number, updateKeywordDto: UpdateKeywordDto) {
    return this.manager.transaction(async (manager) => {
      const existingKeyword = await manager.findOne(Keyword, id);
      if (!existingKeyword)
        throw new NotFoundException(`Keyword with id ${id} was not found`);
      manager.merge(Keyword, existingKeyword, updateKeywordDto);
      return manager.save(existingKeyword);
    });
  }

  remove(id: number) {
    return this.manager.transaction(async (manager) => {
      const existingKeyword = await manager.findOne(Keyword, id);
      if (!existingKeyword)
        throw new NotFoundException(`Keyword with id ${id} was not found`);
      await manager.delete(Keyword, id);
    });
  }
}
