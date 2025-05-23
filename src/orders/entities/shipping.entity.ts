import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: '' })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @OneToOne(() => Order, (order) => order.shipping)
  order: Order;

}