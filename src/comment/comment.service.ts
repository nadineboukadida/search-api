import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction, types } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { LikeCommentDto } from '../like/dto/like-comment.dto';
import { SearchCommentDto } from './dto/search_comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly neo4jService: Neo4jService,private readonly httpService: HttpService) {}

  hydrate(res): Comment {
    if (!res.records.length) {
      return undefined;
    }
    const comment = res.records[0].get('c');
    return new Comment(comment);
  }
  hydrate_mass(res):Comment[] {
    if (!res.records.length) {
      return undefined;
    }
    return res.records.map((element) => new Comment(element.get('c')?.properties));
  }

  async getStudy(studyId) {
    const res = await this.neo4jService.read(
      `
          MATCH (s:Study)
          WHERE s.id = $studyId
          RETURN s
          `,
      { studyId },
    );
    return res;
  }

  async getComment(commentId) {
    const res = await this.neo4jService.read(
      `
           MATCH (c:Comment)
           WHERE c.id = $commentId
           RETURN c
           `,
      { commentId },
    );
    return res;
  } 

  async hcpCommentOwner(hcpId, commentId) {
    const res = await this.neo4jService.read(
      `
           MATCH (c:Comment)
           WHERE c.hcpId = $hcpId AND c.id = $commentId
           RETURN c
           `,
      { hcpId, commentId },
    );
    return res;
  }


  async createComment(
    databaseOrTransaction: string | Transaction,
    commentDto: CreateCommentDto,
  ): Promise<Comment> {
    const { studyId, hcpId, content, fullName } = commentDto;
    const study = await this.getStudy(studyId);
    if (!study.records[0]) {
      throw new BadRequestException('this study ID does not exist');
    }

    const res = await this.neo4jService.write(
      `
        CREATE (c:Comment) SET c += $properties, c.id = randomUUID(), c.number = 0
        WITH c
        MATCH (a:Study) WHERE a.id = "${studyId}"
        CREATE (c)-[r:COMMENT_TO]->(a)
        RETURN (c);
    `,
      {
        properties: {
          content,
          hcpId,
          fullName
        },
      },
      databaseOrTransaction,
    );
    return this.hydrate(res);
  }

  async getCommentByStudyId({ studyId }: SearchCommentDto): Promise<any> {
    const study = await this.getStudy(studyId);
    if (!study.records[0]) {
      throw new BadRequestException('this study ID does not exist');
    }
    const res = await this.neo4jService.read(
      `
        MATCH (c:Comment)-[r:COMMENT_TO]->(s:Study{id : $studyId}) RETURN c
        `,
      { studyId },
    );
    return this.hydrate_mass(res);
  }

  async deleteCommentById({ commentId , hcpId}: DeleteCommentDto) {
    const comment = await this.getComment(commentId);
    if (!comment.records[0]) {
      throw new BadRequestException('this comment does not exist');
    }
    const commentOwned =await this.hcpCommentOwner(hcpId,commentId)
    if(commentOwned.records[0]){
      throw new BadRequestException('this comment is not yours');
    }
    return await this.neo4jService.write(
      `
        MATCH (c:Comment)
        WHERE c.id = $commentId
        DETACH DELETE c
    `,
      { commentId },
    );
  }

  async updateComment({ commentId, newContent,hcpId }: UpdateCommentDto) {
    const comment = await this.getComment(commentId);
    if (!comment.records[0]) {
      throw new BadRequestException('this comment does not exist');
    }
    const commentOwned =await this.hcpCommentOwner(hcpId,commentId)
    if(commentOwned.records[0]){
      throw new BadRequestException('this comment is not yours');
    }
    const res = await this.neo4jService.write(
      `
        MATCH (c:Comment)
        WHERE c.id = $commentId
        SET c.content = $newContent
        RETURN c
    `,
      { commentId, newContent },
    );
    return this.hydrate(res);
  }


}
