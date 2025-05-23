import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: User): Promise<Review> {
    return await this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  async findAllByProduct(@Body('productId') productId: number): Promise<Review[]> {
    return await this.reviewsService.findAllByProduct(productId);
  }

  @Get('all')
  async findAll(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Review> {
    return await this.reviewsService.findOne(+id);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @CurrentUser() user: User): Promise<Review> {
    return await this.reviewsService.update(+id, updateReviewDto, user);
  }

  @AuthorizeRoles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{
    message: string
  }> {
    return this.reviewsService.remove(+id);
  }
}
