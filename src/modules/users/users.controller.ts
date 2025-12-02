import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto, VerifyOtpDto, LoginDto, TestEmailDto } from './dto/users.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user and send OTP' })
  @ApiResponse({ status: 201, description: 'User registered and OTP sent' })
  signup(@Body() signupDto: SignupDto) {
    return this.usersService.signup(signupDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for user activation' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.usersService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Send test OTP email' })
  async testEmail(@Body() body: TestEmailDto) {
    return this.usersService.sendTestEmail(body.email, body.otp);
  }
}
