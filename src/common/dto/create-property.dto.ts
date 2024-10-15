import { IsString, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  pricePerNight: number;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];
}
