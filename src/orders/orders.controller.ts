import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Order } from './entities/order.entity';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User): Promise<Order> {
    return await this.ordersService.create(createOrderDto, user);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(+id);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto, @CurrentUser() user: User): Promise<Order> {
    return await this.ordersService.update(+id, updateOrderStatusDto, user);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('cancel/:id')
  async cancelled(@Param('id') id: string, @CurrentUser() user: User): Promise<Order> {
    return await this.ordersService.cancelled(+id, user);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{
    message: string
  }> {
    return await this.ordersService.remove(+id);
  }
}
