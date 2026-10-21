import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree (parents with children)' })
  getTree() {
    return this.categoriesService.getTree();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a category by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Seed default marketplace categories (admin only)' })
  seed() {
    return this.categoriesService.seed();
  }
}
