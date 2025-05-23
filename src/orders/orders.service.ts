import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Order_Product } from './entities/orders-products.entity';
import { Shipping } from './entities/shipping.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Order_Product) private opRepository: Repository<Order_Product>,
    @InjectRepository(Shipping) private shippingRepository: Repository<Shipping>,
    @Inject(forwardRef(() => ProductsService)) private readonly productService: ProductsService
  ) { }

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const shipping = this.shippingRepository.create({ ...createOrderDto.shippingAddress });

    const s_shipping = await this.shippingRepository.save(shipping);

    const order = this.ordersRepository.create({
      user: user,
      shipping: s_shipping
    })

    const s_order = await this.ordersRepository.save(order);

    let op: {
      order: Order,
      product: Product,
      product_quantity: number,
      product_unit_price: number
    }[] = [];

    let i = 0;

    while (i < createOrderDto.orderedProducts.length) {

      const order = s_order;
      const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id);
      const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
      op.push({
        order,
        product,
        product_quantity,
        product_unit_price
      })
      i++;
    }

    const c_op = this.opRepository.create(op);
    const s_op = await this.opRepository.save(c_op);

    return await this.findOne(s_order.id)
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: {
        user: true,
        shipping: true,
        products: {
          product: true
        }
      }
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        shipping: true,
        products: {
          product: true
        }
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, user: User): Promise<Order> {
    let order = await this.findOne(id)

    if ((order.status === OrderStatus.CANCELLED) || (order.status === OrderStatus.DELIVERED)) {
      throw new BadRequestException(`Order with id ${id} is already ${order.status}`);
    }

    if ((order.status === OrderStatus.PROCESSING) && (updateOrderStatusDto.status != OrderStatus.SHIPPED)) {
      throw new BadRequestException(`Delivery before shipped !!!`);
    }

    if ((updateOrderStatusDto.status === OrderStatus.SHIPPED) && (order.status === OrderStatus.SHIPPED)) {
      return order;
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = user;
    order = await this.ordersRepository.save(order);

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, updateOrderStatusDto.status);
    }

    return order;
  }

  async cancelled(id: number, user: User): Promise<Order> {
    let order = await this.findOne(id);
    if (order.status === OrderStatus.CANCELLED) {
      return order
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedBy = user;
    order = await this.ordersRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELLED);

    return order;
  }

  async findOneByProduct(id: number): Promise<Order_Product> {
    return await this.opRepository.findOne({
      relations: {
        product: true
      },
      where: { product: { id } }
    })
  }

  async remove(id: number): Promise<{
    message: string
  }> {
    const order = await this.findOne(id);
    const shippingId = order.shipping.id;
    if ((order.status === OrderStatus.DELIVERED) || (order.status === OrderStatus.CANCELLED)) {
      await this.opRepository.delete({ order: { id } })
      await this.ordersRepository.delete({ id })
      await this.shippingRepository.delete({ id: shippingId })
      return {
        message: `Order with id ${id} deleted successfully`
      }
    } else {
      throw new BadRequestException(`Order with id ${id} is not delivered or cancelled, you can't delete it`)
    }
  }

  async stockUpdate(order: Order, status: string) {
    let i = 0;
    while (i < order.products.length) {
      const product = order.products[i];
      await this.productService.updateStock(product.product.id, product.product_quantity, status);
      i++;
    }
  }
}
