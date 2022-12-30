import { BasicResponseDto } from '@common/dto';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppResponseInterceptor<T>
  implements NestInterceptor<T, BasicResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BasicResponseDto<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
