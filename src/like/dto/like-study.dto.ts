export class LikeStudyDto {
    hcpId: number;
    studyId:string;
    token?:string;
    fullName?:string;
}
export class getLikedByIdDto {
    hcpId:number
}