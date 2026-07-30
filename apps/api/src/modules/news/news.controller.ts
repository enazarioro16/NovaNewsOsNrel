// Asumimos import de NestJS puro por ahora
import { Controller as NestController, Get as NestGet, Post as NestPost, Put as NestPut, Delete as NestDelete, Body as NestBody, Param as NestParam } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@NestController('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @NestPost()
  create(@NestBody() createNewsDto: CreateNewsDto) {
    return this.newsService.createNews(createNewsDto);
  }

  @NestGet()
  findAll() {
    return this.newsService.getAllNews();
  }

  @NestGet(':id')
  findOne(@NestParam('id') id: string) {
    return this.newsService.getNewsById(id);
  }

  @NestPut(':id')
  update(@NestParam('id') id: string, @NestBody() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(id, updateNewsDto);
  }

  @NestDelete(':id')
  remove(@NestParam('id') id: string) {
    return this.newsService.deleteNews(id);
  }
}
