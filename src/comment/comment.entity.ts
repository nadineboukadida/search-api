import { Node } from 'neo4j-driver';

export class Comment {
  constructor(private readonly node: Node) {}

  getId(): string {
    return (<Record<string, any>>this.node.properties).id;
  }
  getContent(): string {
    return (<Record<string, any>>this.node.properties).content;
  }

  toJson(): Record<string, any> {
    const { id, content, date, hcpId ,fullName, number} = <Record<string, any>>(
      this.node.properties
    );
    return { id, content, date, hcpId ,fullName,number};
  }
}
