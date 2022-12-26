import { HttpException } from '@nestjs/common';
import { catchError, OperatorFunction } from 'rxjs';

export function catchErrorHandler<T>(): OperatorFunction<T, T> {
  return (result$) =>
    result$.pipe(
      catchError((err) => {
        if (err.response?.data) {
          throw new HttpException(err.response.data, err.response.status);
        }
        throw err;
      }),
    );
}
