import { IsNumber, IsString } from "class-validator";

export class SearchCommentDto {
    @IsString()
    studyId: string;
    @IsNumber()
    hcpId?:string;
}
export class SearchReplyDto {
    @IsString()
    commentId: string;
}

