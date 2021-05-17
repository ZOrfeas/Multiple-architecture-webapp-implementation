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
