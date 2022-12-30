import { Controller, Query, ParseIntPipe, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserShowBalanceResponseDto } from '../dto';
import { UserShowBalanceService } from '../services/user-show-balance.service';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly userShowBalanceService: UserShowBalanceService,
  ) {}

  @Get('show-balance')
  showUserBalance(
    @Query('userId', ParseIntPipe) userId: number,
  ): Observable<UserShowBalanceResponseDto> {
    return this.userShowBalanceService.run(userId);
  }
}
