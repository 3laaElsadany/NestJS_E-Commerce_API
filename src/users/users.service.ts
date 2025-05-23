import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { compare, hash } from 'bcrypt';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) { }


  async findAll(): Promise<User[]> {
    let users = await this.usersRepository.find();
    users = users.map(user => {
      delete user.password;
      return user;
    });
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return user;
  }


  async signup(data: SignUpUserDto): Promise<User> {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // Hash the password before saving (assuming you have a hashPassword function)
    // You can use bcrypt or any other hashing library to hash the password
    data.password = await hash(data.password, 10);
    let user = this.usersRepository.create(data);
    user = await this.usersRepository.save(user);
    delete user.password; // Remove password from the response for security reasons
    return user;
  }

  async signin(data: SignInUserDto): Promise<User> {
    // Find the user by email
    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Compare the password
    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    delete user.password; // Remove password from the response for security reasons
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async generateAccessToken(user: User): Promise<string> {
    // Implement your token generation logic here
    // For example, using JWT:
    const payload = { id: user.id, email: user.email, role: user.role };
    // You can also include other user information in the payload if needed
    return await this.jwtService.signAsync(payload);

  }

}
