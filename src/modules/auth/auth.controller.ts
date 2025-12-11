import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, VerifyOtpDto, LoginDto, TestEmailDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LoginResponse, SignupResponse, VerifyOtpResponse } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user and send OTP' })
  @ApiCreatedResponse({ description: 'User registered successfully, OTP sent.', type: SignupResponse })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for user activation' })
  @ApiOkResponse({ description: 'OTP verified successfully', type: VerifyOtpResponse })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'Login successful', type: LoginResponse })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Send test OTP email' })
  async testEmail(@Body() body: TestEmailDto) {
    return this.authService.sendTestEmail(body.email, body.otp);
  }
}
