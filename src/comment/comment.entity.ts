import { Node } from "neo4j-driver"

export class Comment {
    constructor(private readonly node: Node) {}

    getId(): string {
        return (<Record<string, any>> this.node.properties).id
    }
    getContent(): string {
        return (<Record<string, any>> this.node.properties).id
    }

    toJson(): Record<string, any> {
        const { id, studyId, hcpId, content,date } = <Record<string, any>> this.node.properties
        return { id, studyId, hcpId, content,date }
    }
}