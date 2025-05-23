import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService)) private readonly orderService: OrdersService
  ) { }

  async create(createProductDto: CreateProductDto, user: User): Promise<Product> {
    const category = await this.categoryService.findOne(+createProductDto.category);
    if (!category) {
      throw new NotFoundException(`Category with id ${createProductDto.category} is not found`)
    }
    const product = this.productsRepository.create({ ...createProductDto, category, user });
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id }, relations: ['user', 'category'], select: {
        category: {
          id: true,
          title: true
        },
        user: {
          id: true,
          name: true,
          email: true
        }
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} is not found`)
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, user: User): Promise<Product> {
    let product = await this.findOne(id);

    if (updateProductDto.category) {
      const category = await this.categoryService.findOne(+updateProductDto.category);
      product.category = category;
    }
    const { category, ...rest } = updateProductDto;
    product = { ...product, ...rest, user };
    await this.productsRepository.save(product);
    return product;
  }

  async remove(id: number): Promise<{
    message: string
  }> {
    const product = await this.findOne(id);
    const order = await this.orderService.findOneByProduct(id)
    if (order) {
      throw new BadRequestException(`Product with id ${id} is already ordered, you can't delete it`)
    }
    await this.productsRepository.delete({ id })
    return {
      message: `Product with id ${id} deleted successfully`
    }
  }

  async updateStock(id: number, stock: number, status: string): Promise<Product> {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock = product.stock - stock;
    } else {
      product.stock = product.stock + stock;
    }
    product = await this.productsRepository.save(product);
    return product;
  }
}
