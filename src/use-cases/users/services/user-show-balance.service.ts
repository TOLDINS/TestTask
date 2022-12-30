import { User } from '@common/entities';
import ActivityStatus from '@common/enums/user-activity-status.enum';
import { UserRepositiory } from '@common/modules';
import { BaseService } from '@common/services';
import { Injectable, NotFoundException } from '@nestjs/common';
import { from, map, Observable, tap } from 'rxjs';

import { UserShowBalanceResponseDto } from '../dto';

@Injectable()
export class UserShowBalanceService extends BaseService<
  [number],
  UserShowBalanceResponseDto
> {
  constructor(private readonly userRepository: UserRepositiory) {
    super();
  }

  protected execute(userId: number): Observable<UserShowBalanceResponseDto> {
    return this.checkIsUserExist(userId).pipe(
      map((user) => this.toResponse(user)),
    );
  }

  private checkIsUserExist(userId: number): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { id: userId },
        relations: ['balanceRecord'],
      }),
    ).pipe(
      tap((user) => {
        if (!user || user?.status !== ActivityStatus.Active) {
          throw new NotFoundException('User not found!');
        }
      }),
      map((user) => user),
    );
  }

  private toResponse(user: User): UserShowBalanceResponseDto {
    return {
      userId: user.id,
      userName: user.name,
      balance: user.balanceRecord?.getBalance() ?? 0,
    };
  }
}
