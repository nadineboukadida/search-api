import { IsString} from "class-validator";

export class CreateCommentDto {
    @IsString()
    studyId: string;
    @IsString()
    hcpId: string;
    @IsString()
    content: string;
}

export class GetCommentDto {
    @IsString()
    commentId: string;
}