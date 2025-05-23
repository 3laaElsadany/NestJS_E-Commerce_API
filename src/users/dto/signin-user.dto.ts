import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInUserDto {

  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}