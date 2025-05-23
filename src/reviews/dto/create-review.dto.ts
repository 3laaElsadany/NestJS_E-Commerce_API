import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: "Comment is required" })
  comment: string;

  @IsNumber()
  @IsNotEmpty({ message: "retings is required" })
  ratings: number;

  @IsNumber({}, { message: "Product should be number" })
  @IsNotEmpty({ message: "Product is required" })
  product: number;
}
