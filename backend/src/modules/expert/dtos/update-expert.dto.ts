import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateExpertDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;

  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'Phone must contain only numbers' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for profile image' })
  profile_image?: string;

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsUrl(
    {},
    { message: 'Please provide a valid URL for qualification documents' },
  )
  qualification_docs?: string;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}
