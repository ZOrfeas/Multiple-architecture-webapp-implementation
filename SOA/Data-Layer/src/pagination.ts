import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class PaginateUtils {
  @IsNumberString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ description: 'the page number requested', required: false })
  readonly pagenr: string;

  @IsNumberString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'the size of the page to fetch',
    required: false,
  })
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
