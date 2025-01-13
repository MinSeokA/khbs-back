import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: new Date() })
  createdAt: Date;
}