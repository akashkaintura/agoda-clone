// src/modules/properties/dto/update-property.dto.ts
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  pricePerNight?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];
}
