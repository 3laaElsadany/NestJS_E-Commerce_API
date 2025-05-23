import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
    private readonly productService: ProductsService
  ) { }

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    const product = await this.productService.findOne(createReviewDto.product)
    let review = await this.findOneByUserAndProduct(user.id, createReviewDto.product)
    if (!review) {
      review = this.reviewsRepository.create({ ...createReviewDto, user, product })
    } else {
      review = { ...review, ratings: createReviewDto.ratings, comment: createReviewDto.comment };
    }

    return await this.reviewsRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewsRepository.find();
  }

  async findAllByProduct(id): Promise<Review[]> {
    const product = await this.productService.findOne(id)
    return await this.reviewsRepository.find({
      where: {
        product: { id }
      },
      relations: ['user', 'product', 'product.category']
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id }, relations: ['user', 'product', 'product.category'] })
    if (!review) {
      throw new NotFoundException(`Review with id ${id} is not exist`)
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, user: User): Promise<Review> {
    let review = await this.findOne(id);
    const product = await this.productService.findOne(updateReviewDto.product);
    review = { ...review, ...updateReviewDto, product, user }
    return this.reviewsRepository.save(review);
  }

  async remove(id: number): Promise<{
    message: string
  }> {
    await this.findOne(id)
    await this.reviewsRepository.delete({ id })
    return {
      message: `Review with id ${id} is deleted successfully`
    };
  }

  async findOneByUserAndProduct(userId: number, productId: number): Promise<Review> {
    return await this.reviewsRepository.findOne({
      where: {
        user: {
          id: userId
        },
        product: {
          id: productId
        }
      },
      relations: ['user', 'product']
    })
  }
}
