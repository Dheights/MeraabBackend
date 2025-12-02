import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Users } from './entity/user.entity';
import { UserVerification } from './entity/user-verification.entity';
import { SignupDto, VerifyOtpDto, LoginDto } from './dto/users.dto';
import { VerificationStatus } from './interface/users.interface';
import { generateOtp, sendOtpEmail } from '../../helper/user.helper'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    @InjectRepository(UserVerification)
    private readonly verificationRepo: Repository<UserVerification>,
  ) {}

  // ---------- SIGNUP ----------
  async signup(signupDto: SignupDto) {
    const { name, email, password, phoneNo } = signupDto;

    const existing = await this.userRepo.findOne({ where: [{ email }, { phoneNo }] });
    if (existing) {
      throw new BadRequestException('User with this email/phone already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      verified: false,
    });

    const savedUser = await this.userRepo.save(user);

    // Create OTP
    const otp = generateOtp();

    const verification = this.verificationRepo.create({
      user: savedUser,
      otp,
      status: VerificationStatus.PENDING,
      otpSentAt: new Date(),
      otpVerifiedAt: null,
    });

    await this.verificationRepo.save(verification);

    // Send OTP via email (simple example using nodemailer)
    await sendOtpEmail(email, otp);

    return {
      message: 'Signup successful. OTP sent to your email.',
      userId: savedUser.id,
    };
  }

  // ---------- VERIFY OTP ----------
  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find latest pending verification for this user
    const verification = await this.verificationRepo.findOne({
      where: { user: { id: user.id }, status: VerificationStatus.PENDING, otp },
      order: { otpSentAt: 'DESC' },
      relations: ['user'],
    });

    if (!verification) {
      throw new BadRequestException('Invalid OTP');
    }

    // Optional: check OTP expiry (e.g. 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (verification.otpSentAt < tenMinutesAgo) {
      verification.status = VerificationStatus.EXPIRED;
      await this.verificationRepo.save(verification);
      throw new BadRequestException('OTP expired');
    }

    // Mark verified
    verification.status = VerificationStatus.VERIFIED;
    verification.otpVerifiedAt = new Date();
    await this.verificationRepo.save(verification);

    user.verified = true;
    await this.userRepo.save(user);

    return {
      message: 'OTP verified successfully',
    };
  }

  // ---------- LOGIN ----------
  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.verified) {
      throw new UnauthorizedException('Please verify your account first');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If you want JWT, generate here and return token instead.
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
      },
    };
  }

  // ---------- TESTING ----------
  async sendTestEmail(email: string, otp: string) {
    await sendOtpEmail(email, otp);

    return {
      message: 'Email sent successfully',
      email,
      otp
    };
  }
}
