import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetCommentDto, GetStudyDto } from 'src/comment/dto/create-comment.dto';
import { LikeCommentDto } from 'src/like/dto/like-comment.dto';
import { HcpGuard } from 'src/guard/is-hcp.guard';
import { LikeService } from './like.service';
import { LikeStudyDto } from './dto/like-study.dto';

@Controller()
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('comment/get_likes')
  async getLikesByCommentId(@Body() getCommentDto: GetCommentDto) {
    const likes = await this.likeService.getLikesByCommentId(getCommentDto);
    return { message: 'success', result: likes };
  }
  @Post('like_comment')
  @UseGuards(HcpGuard)
  async likeComment(@Body() likeCommentDto: LikeCommentDto) {
    const comment = await this.likeService.likeComment(likeCommentDto);
    return { message: 'success', result: comment };
  }

  @Post('study/get_likes')
  async getLikesBystudyId(@Body() getstudytDto: GetStudyDto) {
    const likes = await this.likeService.getLikesByStudyId(getstudytDto);
    return { message: 'success', result: likes };
  }
  @Post('like_study')
  @UseGuards(HcpGuard)
  async likestudy(@Body() likestudytDto: LikeStudyDto) {
    const study = await this.likeService.likestudy(likestudytDto);
    return { message: 'success', result: study };
  }
}
