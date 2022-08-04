import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction, types } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { SearchCommentDto } from './dto/search_comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly neo4jService: Neo4jService) {}

  private hydrate(res): Comment {
    if (!res.records.length) {
      return undefined;
    }
    const comment = res.records[0].get('c');
    return new Comment(comment);
  }
  private async getStudy(studyId) {
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
  private async getComment(commentId) {
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

  async createComment(
    databaseOrTransaction: string | Transaction, commentDto: CreateCommentDto): Promise<Comment> {
    const { studyId, hcpId, content } = commentDto;
    const study = await this.getStudy(studyId);
    if (!study.records[0]) {
      throw new BadRequestException('this study ID does not exist');
    }

    const res = await this.neo4jService.write(
      `
        CREATE (c:Comment) SET c += $properties, c.id = randomUUID()
        WITH c
        MATCH (a:Study) WHERE a.id = "${studyId}"
        CREATE (c)-[r:COMMENT_TO]->(a)
        RETURN (c);
    `,
      {
        properties: {
          content,
        },
      },
      databaseOrTransaction,
    );
    return this.hydrate(res)
  }

  async getCommentByStudyId({ studyId }: SearchCommentDto): Promise<any> {
    const res = await this.neo4jService.read(
      `
        MATCH (c:Comment)-[r:COMMENT_TO]->(s:Study{id : $studyId}) RETURN c
        `,
      { studyId },
    );
    return res.records;
  }

  async deleteCommentById({commentId}: DeleteCommentDto) {
    const comment = await this.getComment(commentId);
    if (!comment.records[0]) {
        throw new BadRequestException('this comment does not exist');
      }
    return await this.neo4jService.write(`
        MATCH (c:Comment)
        WHERE c.id = $commentId
        DETACH DELETE c
    `, { commentId })
        
}

async updateComment({commentId,newContent}: UpdateCommentDto) {
    const comment = await this.getComment(commentId);
    if (!comment.records[0]) {
        throw new BadRequestException('this comment does not exist');
      }
      const res = await this.neo4jService.write(`
        MATCH (c:Comment)
        WHERE c.id = $commentId
        SET c.content = $newContent
        RETURN c
    `, { commentId , newContent})
    return this.hydrate(res)
}
async likeComment(likeCommentDto: LikeCommentDto): Promise<Comment> {
  const { commentId, hcpId} = likeCommentDto;
  const comment = await this.getComment(commentId);
  if (!comment.records[0]) {
    throw new BadRequestException('this comment ID does not exist');
  }

  const res = await this.neo4jService.write(
    `
      CREATE (l:Like) SET l += $properties, l.id = randomUUID()
      WITH l
      MATCH (c:Comment) WHERE c.id = $commentId"
      CREATE (l)-[r:ASSIGNED_TO]->(c)
      RETURN (c);
  `,
    {
      properties: {
        commentId,
      },
    });
  return this.hydrate(res)
}

}
