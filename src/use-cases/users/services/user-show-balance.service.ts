import { User } from '@common/entities';
import ActivityStatus from '@common/enums/user-activity-status.enum';
import { catchErrorHandler } from '@common/handler';
import { BaseService } from '@common/services';
import { Injectable, NotFoundException } from '@nestjs/common';
import { from, map, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

import { UserShowBalanceResponse } from '../dto';

@Injectable()
export class UserShowBalanceService extends BaseService<[number], any> {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  protected execute(userId: number): Observable<UserShowBalanceResponse> {
    return this.checkIsUserExist(userId).pipe(
      map((user) => this.toResponse(user)),
      catchErrorHandler(),
    );
  }

  private checkIsUserExist(userId: number): Observable<User> {
    return from(
      this.dataSource
        .getRepository(User)
        .findOne({ where: { id: userId }, relations: ['balanceRecord'] }),
    ).pipe(
      tap((user) => {
        if (!user || user?.status !== ActivityStatus.Active) {
          throw new NotFoundException('User not found!');
        }
      }),
      map((user) => user),
    );
  }

  private toResponse(user: User): UserShowBalanceResponse {
    return {
      userId: user.id,
      userName: user.name,
      balance: user.balanceRecord?.getBalance() ?? 0,
    };
  }
}
