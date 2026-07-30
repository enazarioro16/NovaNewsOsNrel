import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsRepository } from './news.repository';
import { INewsRepositoryToken } from './news.repository.interface';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    {
      provide: INewsRepositoryToken,
      useClass: NewsRepository,
    },
  ],
})
export class NewsModule {}
