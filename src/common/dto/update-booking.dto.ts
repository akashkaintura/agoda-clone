import { IsDate, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsDate()
  @IsOptional()
  checkInDate?: Date;

  @IsDate()
  @IsOptional()
  checkOutDate?: Date;
}
