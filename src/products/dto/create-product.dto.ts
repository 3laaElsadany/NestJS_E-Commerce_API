import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price should be a number & max decimal percission 2" })
  @IsPositive({ message: "Price should be positive" })
  @IsNotEmpty({ message: "Price is required" })
  price: number;

  @IsNumber({}, { message: "Stock should be a number" })
  @IsNotEmpty({ message: "Stock is required" })
  @Min(0, { message: "Stock can not be negative" })
  stock: number;

  @IsArray()
  @IsNotEmpty({ message: "Image is required" })
  image: string[];

  @IsNumber({}, { message: "Category should be a number" })
  @IsNotEmpty({ message: "Category is required" })
  category: number;
}
