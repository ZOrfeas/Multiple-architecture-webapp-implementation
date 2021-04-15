import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Keyword } from '../../keyword/entities/keyword.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne((type) => Keyword, (keyword) => keyword.user)
  keyword: Keyword;
}
