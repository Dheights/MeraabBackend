import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, VerifyOtpDto, LoginDto, TestEmailDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user and send OTP' })
  @ApiResponse({ status: 201, description: 'User registered and OTP sent' })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for user activation' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Send test OTP email' })
  async testEmail(@Body() body: TestEmailDto) {
    return this.authService.sendTestEmail(body.email, body.otp);
  }
}
