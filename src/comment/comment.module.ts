import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [CommentService],
  imports:[HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  })],
  controllers: [CommentController],
  exports: [CommentService]
})
export class CommentModule {}
