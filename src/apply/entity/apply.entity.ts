import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("apply")
export class Apply {
  @PrimaryGeneratedColumn()
  id: number;

  // 학생 정보
  @Column({ nullable: true }) // 학생 이름
  name: string; 

  @Column({ nullable: true, type: "int" }) // 학생 학번
  studentId: number;

  @Column({ nullable: true }) // 학생 비밀번호
  password: string;

  @Column({ nullable: true }) // 학생 전화번호
  phoneNumber: number;

  @Column({ nullable: true }) // 면접일
  interviewDate: Date;

  @Column({ nullable: true }) // 지원 동기
  applyReason: string;

  @Column({ nullable: true }) // 하고 싶은 말
  comment: string;

  // 생성일
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;
}
