import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";
import { Order } from "../entities/order.entity";


export class UpdateOrderStatusDto {
  @IsString({ message: "Status must be a string" })
  @IsNotEmpty({ message: "Status is required" })
  @IsIn([OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.DELIVERED, OrderStatus.PROCESSING])
  status: string;
}
