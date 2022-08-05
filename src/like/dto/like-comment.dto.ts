import { IsString } from "class-validator";

export class LikeCommentDto {
    hcpId: string;
    commentId:string;
    token?:string;
    fullName?:string;
}

