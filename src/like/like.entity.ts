import { Node } from "neo4j-driver"

export class Like {
    constructor(private readonly node: Node) {}

    getId(): string {
        return (<Record<string, any>> this.node.properties).id
    }
    
    toJson(): Record<string, any> {
        const { id } = <Record<string, any>> this.node.properties
        return { id }
    }
}