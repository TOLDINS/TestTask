import { HttpException, Injectable, Logger } from '@nestjs/common';
import { catchError, OperatorFunction } from 'rxjs';

@Injectable()
export class ErrorHandlerService {
  private logger = new Logger(ErrorHandlerService.name);
  catchError<T>(): OperatorFunction<T, T> {
    return (result$) =>
      result$.pipe(
        catchError((err) => {
          this.logger.error(err.response?.data ?? err);
          if (err.response?.data) {
            throw new HttpException(err.response.data, err.response.status);
          }
          throw err;
        }),
      );
  }
}
