import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Users } from './entity/user.entity';
import { UserVerification } from './entity/user-verification.entity';
import { SignupDto, VerifyOtpDto, LoginDto } from './dto/auth.dto';
import { VerificationStatus } from './interface/auth.interface';
import { generateOtp, sendOtpEmail } from '../../helper/user.helper'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(UserVerification)
    private readonly verificationRepo: Repository<UserVerification>,

    private readonly jwtService: JwtService,
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
      message: 'Signup successful. OTP sent.',
      userId: user.id,
    };
  }

  // ---------- VERIFY OTP ----------
  async verifyOtp(dto: VerifyOtpDto) {
    const { userId, otp } = dto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 🟢 CASE 1: User already verified → return token
    if (user.verified) {
      const payload = { id: user.id, email: user.email };
      const token = this.jwtService.sign(payload, { expiresIn: '1d' });

      return {
        status: 200,
        message: 'User already verified',
        token,
      };
    }

    // 🟢 CASE 2: User NOT verified → check OTP
    const verification = await this.verificationRepo.findOne({
      where: { user: { id: userId }, status: VerificationStatus.PENDING },
      order: { otpSentAt: 'DESC' },
    });

    if (!verification) {
      throw new BadRequestException('No pending OTP found');
    }

    if (verification.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // OTP expiry check
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (verification.otpSentAt < fiveMinutesAgo) {
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

    // Generate JWT token
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '1d' });

    return {
      status: 200,
      message: 'OTP verified successfully',
      token,
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

    // Generate JWT token
    const payload = { id: user.id, name: user.name, email: user.email, phoneNo: user.phoneNo, verified: user.verified };
    const token = this.jwtService.sign(payload, { expiresIn: '1d' });

    return {
      status: 200,
      message: 'Login successful',
      token
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
