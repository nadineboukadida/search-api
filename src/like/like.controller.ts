import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetCommentDto } from 'src/comment/dto/create-comment.dto';
import { LikeCommentDto } from 'src/like/dto/like-comment.dto';
import { HcpGuard } from 'src/guard/is-hcp.guard';
import { LikeService } from './like.service';

@Controller()
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('get_likes')
  getLikesByCommentId(@Body() getCommentDto:GetCommentDto){
    console.log(getCommentDto)
       const likes =  this.likeService.getLikesByCommentId(getCommentDto)
       return {message: "success" , result: likes}
    }
    @Post('like_comment')
    @UseGuards(HcpGuard)
    async likeComment(@Body() likeCommentDto : LikeCommentDto){
     const comment = await this.likeService.likeComment(likeCommentDto);
      return {message: "success" , result: comment}
    }
    
}
