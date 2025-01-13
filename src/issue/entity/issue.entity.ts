import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('Issue')
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  response: string;

  @Column({ default: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) })
  createAt: string;


  @Column({ default: new Date() })
  createdAt: Date;

  // 상태 | 1 = 진행 중, 2 = 해결됨
  @Column({ default: 1 })
  status: number;
}
