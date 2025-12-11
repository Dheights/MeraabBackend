import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: "Example User" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "9XXXXXXXXX" })
  @IsString()
  phoneNo?: string;

  @ApiProperty({ example: "secret123" })
  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: "c1a34b52-8f0a-4c8a-9c59-23ac49de72c1" })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: "123456" })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class LoginDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "secret123" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

// For testing
export class TestEmailDto {
  @ApiProperty({ example: "akshit@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "123456" })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
