import { BadRequestException } from '@nestjs/common';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class PaginateUtils {
  @IsNumberString()
  @IsOptional()
  @IsNotEmpty()
  readonly pagenr: string;

  @IsNumberString()
  @IsOptional()
  @IsNotEmpty()
  readonly pagesize: string;
}

export function paginateOrNot(pageInfo: PaginateUtils, paginate, notPaginate) {
  if (
    typeof pageInfo.pagenr === 'undefined' &&
    typeof pageInfo.pagesize === 'undefined'
  ) {
    return notPaginate();
  } else if (
    typeof pageInfo.pagenr === 'undefined' ||
    typeof pageInfo.pagesize === 'undefined'
  ) {
    throw new BadRequestException(
      'Please specify both or neither of pagesize and pagenr params',
    );
  } else {
    return paginate();
  }
}
