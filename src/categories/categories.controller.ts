import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: User): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findOne(+id);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{
    message:string
  }> {
    return await this.categoriesService.remove(+id);
  }
}
