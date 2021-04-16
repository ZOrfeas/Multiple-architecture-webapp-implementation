import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Answer } from '../../answer/entities/answer.entity';
import { Keyword } from '../../keyword/entities/keyword.entity';
import { JoinTable } from 'typeorm/browser';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  questContent: string;

  @Column({ type: 'timestamptz' })
  askedOn: Date;

  @ManyToOne(() => User, (user) => user.questions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToMany(() => Keyword, (keyword) => keyword.questions, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  keywords: Keyword[];
}
