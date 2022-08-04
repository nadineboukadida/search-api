import { IsString } from "class-validator";

export class SearchCommentDto {
    @IsString()
    studyId: string
}