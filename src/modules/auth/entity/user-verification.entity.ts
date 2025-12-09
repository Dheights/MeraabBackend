import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { VerificationStatus } from '../interface/auth.interface';

@Entity('user_verification')
export class UserVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otp: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ name: 'otp_sent_at', type: 'timestamp' })
  otpSentAt: Date;

  @Column({ name: 'otp_verified_at', type: 'timestamp', nullable: true })
  otpVerifiedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.verifications, { onDelete: 'CASCADE' })
  user: Users;
}
