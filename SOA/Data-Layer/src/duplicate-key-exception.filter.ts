import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DuplicateKeyExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DuplicateKeyExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const msg = exception.message;
    const duplicateKeyMsg = 'duplicate key value violates unique constraint';
    if (msg.startsWith(duplicateKeyMsg)) {
      this.logger.warn('User creation attempt with existing email');
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      response.status(400).json({
        statusCode: 400,
        message: 'Email already exists',
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }
}
