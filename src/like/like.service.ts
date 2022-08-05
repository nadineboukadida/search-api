import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { GetCommentDto, GetStudyDto } from 'src/comment/dto/create-comment.dto';
import { LikeCommentDto } from 'src/like/dto/like-comment.dto';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { LikeStudyDto } from './dto/like-study.dto';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly commentService: CommentService,
  ) {}

  hydrate(res): Like[] {
    if (!res.records.length) {
      return undefined;
    }
    return res.records.map((element) => new Like(element.get('l')?.properties));
  }

  async getLikesByCommentId({ commentId }: GetCommentDto) {
    const comment = await this.commentService.getComment(commentId);
    if (!comment.records[0]) {
      throw new BadRequestException('this comment ID does not exist');
    }
    const res = await this.neo4jService.read(
      `
            MATCH (l:Like)-[r:ASSIGNED_TO]->(c:Comment{id : $commentId}) RETURN l
            `,
      { commentId },
    );
    return this.hydrate(res);
  }

  async likeComment(likeCommentDto: LikeCommentDto): Promise<any> {
    const { commentId, hcpId, fullName } = likeCommentDto;
    const comment = await this.commentService.getComment(commentId);

    if (!comment.records[0]) {
      throw new BadRequestException('this comment ID does not exist');
    }
    const liked = await this.neo4jService.write(
      `
            MATCH (l:Like {hcpId: $hcpId})-[r:ASSIGNED_TO]->(c:Comment{id : $commentId}) RETURN l
        `,
      {
        commentId,
        fullName,
        hcpId,
      },
    );

    if (liked.records[0]) {
      var res = await this.neo4jService.write(
        `
                MATCH (l:Like {hcpId: $hcpId})-[r:ASSIGNED_TO]->(c:Comment{id : $commentId})
                DETACH DELETE l
            `,
        { commentId, fullName, hcpId },
      );
    } else {
      var res = await this.neo4jService.write(
        `
          CREATE (l:Like) SET l += $properties, l.id = randomUUID()
          WITH l
          MATCH (c:Comment) WHERE c.id = $commentId
          CREATE (l)-[r:ASSIGNED_TO]->(c)
          RETURN (c)
      `,
        { properties: { hcpId }, commentId, fullName },
      );
    }
    return res.records[0];
  }

  async getLikesByStudyId({ studyId }: GetStudyDto) {
    const study = await this.commentService.getStudy(studyId);
    if (!study.records[0]) {
      throw new BadRequestException('this study ID does not exist');
    }
    const res = await this.neo4jService.read(
      `
            MATCH (l:Like)-[r:ASSIGNED_TO]->(s:Study{id : $studyId}) RETURN l
            `,
      { studyId },
    );
    return this.hydrate(res);
  }

  async likestudy(likestudyDto: LikeStudyDto): Promise<any> {
    const { studyId, hcpId, fullName } = likestudyDto;
    const study = await this.commentService.getStudy(studyId);

    if (!study.records[0]) {
      throw new BadRequestException('this study ID does not exist');
    }
    const liked = await this.neo4jService.write(
      `
            MATCH (l:Like {hcpId: $hcpId})-[r:ASSIGNED_TO]->(s:Study{id : $studyId}) RETURN l
        `,
      {
        studyId,
        fullName,
        hcpId,
      },
    );

    if (liked.records[0]) {
      var res = await this.neo4jService.write(
        `
                MATCH (l:Like {hcpId: $hcpId})-[r:ASSIGNED_TO]->(c:Study{id : $studyId})
                DETACH DELETE l
            `,
        { studyId, fullName, hcpId },
      );
    } else {
      var res = await this.neo4jService.write(
        `
          CREATE (l:Like) SET l += $properties, l.id = randomUUID()
          WITH l
          MATCH (s:Study) WHERE s.id = $studyId
          CREATE (l)-[r:ASSIGNED_TO]->(s)
          RETURN (l)
      `,
        { properties: { hcpId }, studyId, fullName },
      );
    }
    return res.records[0];
  }
}
