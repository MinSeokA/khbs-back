import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { FastifyRequest, FastifyReply } from 'fastify'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();

        if (response.statusCode === 204) return response.send(); 

        response.send({
          code: response.statusCode.toString().startsWith('2') ? 'OPERATION_SUCCESS' : HttpStatus[response.statusCode],
          status: response.statusCode,
          data,
          responseAt: new Date().toISOString(),
        })
      })
    )
  }
}
