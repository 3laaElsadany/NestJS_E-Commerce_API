import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Shipping } from './shipping.entity';
import { Order_Product } from './orders-products.entity';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shipping: Shipping;

  @OneToMany(() => Order_Product, (op) => op.order, { cascade: true })
  products: Order_Product[];

  @ManyToOne(() => User, (user) => user.ordersUpdateBy)
  updatedBy: User;

}