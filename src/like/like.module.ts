import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CommentModule } from 'src/comment/comment.module';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports:[CommentModule, HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),],
  controllers: [LikeController],
  providers: [LikeService]
})
export class LikeModule {}
