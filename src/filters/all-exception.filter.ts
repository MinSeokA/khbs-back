import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common'

import APIException from './dto/api-exception.dto';
import { FastifyReply } from 'fastify'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);
  
    catch(exception: any, host: ArgumentsHost) {
        this.logger.error(exception);

        const ctx = host.switchToHttp();
        const response: FastifyReply<any> = ctx.getResponse<FastifyReply>();

        const responseAt: string = new Date().toISOString();

        let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object | APIException = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse();
        }

        if (exception instanceof APIException) {
            response.status(exception.status).send({
                code: HttpStatus[exception.status],
                status: exception.status,
    
                data: exception.data,
                message: exception.message,
                responseAt: responseAt,

            })
            return
        }

        response.status(status).send({
            code: HttpStatus[status],
            status: status,

            message: message['message'] || message['error'] || message,
            responseAt: responseAt,
        });
    }
}
  