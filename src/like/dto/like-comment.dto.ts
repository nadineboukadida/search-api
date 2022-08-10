import { IsString } from "class-validator";

export class LikeCommentDto {
    hcpId: number;
    commentId:string;
    token?:string;
    fullName?:string;
}

