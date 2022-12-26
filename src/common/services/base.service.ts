import { BadRequestException } from '@nestjs/common';
import { Observable, of, switchMap, tap } from 'rxjs';

export abstract class BaseService<T extends Array<unknown>, R> {
  run(...args: T): Observable<R> {
    return this.canActive(...args).pipe(
      tap((canActive) => {
        if (!canActive) {
          throw new BadRequestException();
        }
      }),
      switchMap(() => this.execute(...args)),
    );
  }
  protected canActive(...args: T): Observable<boolean> {
    return of(true);
  }
  protected abstract execute(...args: T): Observable<R>;
}
