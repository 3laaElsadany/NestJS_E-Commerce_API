import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class OrderedProductsDto {
  @IsNotEmpty({ message: "Product ID is required" })
  id: number;

  @IsPositive({ message: "Price must be positive" })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price should be number and max decimal precission 2" })
  product_unit_price: number;

  @IsPositive({ message: "Quantity must be positive" })
  @IsNumber({}, { message: "Quantity should be number" })
  product_quantity: number;
}
