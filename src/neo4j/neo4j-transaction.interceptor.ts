import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Transaction } from "neo4j-driver"
import { catchError, Observable, tap } from "rxjs"
import { Neo4jService } from "./neo4j.service"

@Injectable()
export class Neo4jTransactionInterceptor implements NestInterceptor {

    constructor(private readonly neo4jService: Neo4jService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const transaction: Transaction = this.neo4jService.beginTransaction()

        context.switchToHttp().getRequest().transaction = transaction

        return next.handle()
            .pipe(
                tap(() => {
                    transaction.commit()
                }),
                catchError(e => {
                    transaction.rollback()
                    throw e
                })
            )

    }

}