import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoriesRepository: Repository<Category>,
  ) { }


  async create(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      user
    })
    return await this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find()
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id }, relations: ['user'], select: {
        user: {
          email: true,
          id: true,
          name: true
        }
      }
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} is not found`)
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    let category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not exist`)
    }
    category = { ...category, ...updateCategoryDto };
    await this.categoriesRepository.save(category);
    return category;
  }

  async remove(id: number): Promise<{
    message: string
  }> {

    await this.findOne(id);
    await this.categoriesRepository.delete({ id })

    return {
      message: `Category with id ${id} deleted successfully`
    }

  }
}
