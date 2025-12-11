import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNo: string;
}

export class SignupResponse {
  @ApiProperty({ example: "Signup successful. OTP sent." })
  message: string;

  @ApiProperty({ example: "23c2c43e-1f44-4a57-afab-105cd50fcb41" })
  userId: string;
}

export class VerifyOtpResponse {
  @ApiProperty()
  status: number;

  @ApiProperty({ example: "OTP verified successfully" })
  message: string;

  @ApiProperty()
  token: string;
}

export class LoginResponse {
  @ApiProperty()
  status: number;

  @ApiProperty({ example: "Login successful" })
  message: string;

  @ApiProperty()
  token: string;
}
