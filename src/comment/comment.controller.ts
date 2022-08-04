import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { Transaction } from 'neo4j-driver';
import { Neo4jTransactionInterceptor } from 'src/neo4j/neo4j-transaction.interceptor';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { SearchCommentDto } from './dto/search_comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}


  @UseInterceptors(Neo4jTransactionInterceptor)
  @Post('add_comment')
  async addComment(@Body() commentDto: CreateCommentDto, @Request() req) {
    const transaction: Transaction = req.transaction;

    const comment = await this.commentService.createComment(
      transaction,
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
    //todo format the comments
  }

  @Delete('delete_comment')
  async deleteCommentById(@Body() deleteCommentDto:DeleteCommentDto){
    await this.commentService.deleteCommentById(deleteCommentDto);
    return {message: "deleted" }
  }
  
  @Patch('update_comment')
  async updateComment(@Body() updateCommentDto : UpdateCommentDto){
   const comment = await this.commentService.updateComment(updateCommentDto);
    return {message: "success" , result: comment.toJson()}
  }

}
