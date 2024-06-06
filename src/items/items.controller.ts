import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ItemEntity } from './entities/item.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('items')
@ApiTags('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ItemEntity })
  async create(@Body() createItemDto: CreateItemDto) {
    return new ItemEntity(await this.itemsService.create(createItemDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ItemEntity, isArray: true })
  async findAll() {
    const items = await this.itemsService.findAll();
    return items.map((item) => new ItemEntity(item));
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ItemEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.itemsService.findDrafts();
    return drafts.map((draft) => new ItemEntity(draft));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ItemEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException(`with ${id} does not exist.`);
    }
    return new ItemEntity(item);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ItemEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateItemDto,
  ) {
    return new ItemEntity(await this.itemsService.update(id, updateArticleDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ItemEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ItemEntity(await this.itemsService.remove(id));
  }
}
