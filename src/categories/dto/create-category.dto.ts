import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString({ message: 'title should be string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsString({ message: 'description should be string' })
  @IsNotEmpty({ message: 'description is required' })
  description: string;
}