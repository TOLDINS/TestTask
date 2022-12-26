import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(objectOrError: Record<string, any>) {
    super(
      { statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: objectOrError },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
