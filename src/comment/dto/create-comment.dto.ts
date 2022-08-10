import { IsNumber, IsString} from "class-validator";

export class CreateCommentDto {
    @IsString()
    studyId: string;
    @IsNumber()
    hcpId: number;
    @IsString()
    content: string;
    fullName?:string;
    hcpToken?:string
    commentId?:string;
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