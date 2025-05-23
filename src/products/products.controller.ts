import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: User): Promise<Product> {
    return await this.productsService.create(createProductDto, user);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(+id);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: User): Promise<Product> {
    return await this.productsService.update(+id, updateProductDto, user);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{
    message: string
  }> {
    return this.productsService.remove(+id);
  }
}
