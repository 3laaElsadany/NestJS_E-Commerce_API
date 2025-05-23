import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { SignInUserDto } from './dto/signin-user.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  async signup(@Body() data: SignUpUserDto): Promise<User> {
    return await this.usersService.signup(data);
  }


  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('allUsers')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  async profile(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(+id);
  }

  @Post('signin')
  async signin(@Body() data: SignInUserDto): Promise<{
    accessToken: string;
    user: User;
  }> {
    const user = await this.usersService.signin(data);
    const accessToken = await this.usersService.generateAccessToken(user);
    return { accessToken, user };
  }

}
