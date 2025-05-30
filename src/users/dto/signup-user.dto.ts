import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { SignInUserDto } from "./signin-user.dto";

export class SignUpUserDto extends SignInUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

}
