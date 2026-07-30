import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INewsRepository, INewsRepositoryToken } from './news.repository.interface';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @Inject(INewsRepositoryToken)
    private readonly newsRepository: INewsRepository,
  ) {}

  async createNews(dto: CreateNewsDto) {
    return this.newsRepository.create(dto);
  }

  async getAllNews() {
    return this.newsRepository.findAll();
  }

  async getNewsById(id: string) {
    const news = await this.newsRepository.findById(id);
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async updateNews(id: string, dto: UpdateNewsDto) {
    const updated = await this.newsRepository.update(id, dto);
    if (!updated) throw new NotFoundException('News not found');
    return updated;
  }

  async deleteNews(id: string) {
    const deleted = await this.newsRepository.delete(id);
    if (!deleted) throw new NotFoundException('News not found');
    return true;
  }
}
