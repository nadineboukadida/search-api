import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import neo4j, { Driver, Result, session, Session, Transaction } from 'neo4j-driver';
import { Neo4jConfig } from 'src/neo4j-config.interface';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.constants';
@Injectable()
export class Neo4jService implements OnApplicationShutdown {

    constructor(
        @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
        @Inject(NEO4J_DRIVER) private readonly driver: Driver
    ) {}

    getDriver(): Driver {
        return this.driver;
    }

    getConfig(): Neo4jConfig {
        return this.config;
    }


    getReadSession(database?: string): Session {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.READ,
        })
    }
    getWriteSession(database?: string): Session  {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.WRITE,
        })
    }

    read(cypher: string, params: Record<string, any>, database?: string): Result {
        const session = this.getReadSession(database)
        return session.run(cypher, params)
    }

    write(cypher: string, params: Record<string, any>, database?: string): Result {
        const session = this.getWriteSession(database)
        return session.run(cypher, params)
    }

    onApplicationShutdown() {
        return this.driver.close()
    }

}
