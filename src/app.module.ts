import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudyModule } from './study/study.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jConfig } from './neo4j-config.interface';

@Module({
  imports: [StudyModule, CommentModule, LikeModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService, ],
      useFactory: (configService: ConfigService) : Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_DATABASE'),
      })
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}