import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserVerification } from './user-verification.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_no', unique: true })
  phoneNo: string;

  @Column()
  password: string;

  @Column({ default: false })
  verified: boolean;

  @OneToMany(() => UserVerification, (verification) => verification.user)
  verifications: UserVerification[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
