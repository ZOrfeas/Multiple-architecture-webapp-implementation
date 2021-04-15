import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    // This is the interface of the User Entity that can be used to interact with the database.
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectEntityManager() private manager: EntityManager,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.manager.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, id);
      if (!existingUser) throw new NotFoundException(`User with id ${id} was not found`);
      manager.merge(User, existingUser, updateUserDto);
      return this.manager.save(existingUser);
    });
  }

  remove(id: number): Promise<void> {
    return this.manager.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, id);
      if (!existingUser) throw new NotFoundException(`User with id ${id} was not found`);
      await manager.delete(User, id);
    });
  }
}
