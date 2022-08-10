import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Transaction } from 'neo4j-driver';
import { HcpGuard } from 'src/guard/is-hcp.guard';
import { Neo4jTransactionInterceptor } from 'src/neo4j/neo4j-transaction.interceptor';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { LikeCommentDto } from '../like/dto/like-comment.dto';
import { SearchCommentDto, SearchReplyDto } from './dto/search_comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}


  @UseInterceptors(Neo4jTransactionInterceptor)
  @Post('add_comment')
  @UseGuards(HcpGuard)
  async addComment(@Body() commentDto: CreateCommentDto, @Request() req) {

    const comment = await this.commentService.createComment(
      commentDto,
    );
    return {message: "success" , result: comment.toJson()}
  }

  @Post('get_comment')
  async getAllCommentsBySearchId(@Body() searchCommentDto: SearchCommentDto) {
    const comments = await this.commentService.getCommentByStudyId(
        searchCommentDto,
    );
    return {message: "success" , result: comments}
  }

  @Post('delete_comment')
  @UseGuards(HcpGuard)
  async deleteCommentById(@Body() deleteCommentDto:DeleteCommentDto){
    await this.commentService.deleteCommentById(deleteCommentDto);
    return {message: "deleted" }
  }
  
  @Patch('update_comment')
  @UseGuards(HcpGuard)
  async updateComment(@Body() updateCommentDto : UpdateCommentDto){
   const comment = await this.commentService.updateComment(updateCommentDto);
    return {message: "success" , result: comment.toJson()}
  }

  @UseInterceptors(Neo4jTransactionInterceptor)
  @Post('add_reply')
  @UseGuards(HcpGuard)
  async addReply(@Body() commentDto: CreateCommentDto, @Request() req) {

    const comment = await this.commentService.createReply(
      commentDto
    );
    return {message: "success" , result: comment.toJson()}
  }

  @Post('get_reply')
  async getAllRepliesByCommentId(@Body() SearchReplyDto: SearchReplyDto) {
    const replies = await this.commentService.getRepliesByCommentId(
        SearchReplyDto
    );
    return {message: "success" , result: replies}
  }

}
