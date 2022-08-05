import { IsString} from "class-validator";

export class CreateCommentDto {
    @IsString()
    studyId: string;
    @IsString()
    hcpId: string;
    @IsString()
    content: string;
    fullName?:string;
}

export class GetCommentDto {
    @IsString()
    commentId: string;
    fullName?:string;
}
export class GetStudyDto {
    @IsString()
    studyId: string;
    fullName?:string;
}