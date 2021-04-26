import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { Keyword } from '../../keyword/entities/keyword.entity';
import { Answer } from '../../answer/entities/answer.entity';
import { Question } from '../../question/entities/question.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Keyword, (keyword) => keyword.user)
  keyword: Keyword;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];
}
