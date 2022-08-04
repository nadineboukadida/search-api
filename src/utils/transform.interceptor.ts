import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response {
    statusCode: number;
    message: string;
    data: any;
  }
  
  @Injectable()
  export class TransformInterceptor implements NestInterceptor {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response> {
      return next
        .handle()
        .pipe(
          map((data) => ({
            statusCode: data.status? data.status : context.switchToHttp().getResponse().statusCode,
            message: data.message? data.message : '-',
            data: {
              result: data.result?  data.result : '-'
            }
          })),
        );
    }
  }
