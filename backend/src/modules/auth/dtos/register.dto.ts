import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO for user registration
 * Validates all required fields for creating a new user account
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsString({ message: 'Confirm password must be a string' })
  confirm_password: string;

  @IsNotEmpty({ message: 'User type is required' })
  @IsIn(['farmer', 'expert'], {
    message: 'User type must be either farmer or expert',
  })
  user_type: 'farmer' | 'expert';

  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'Phone must contain only numbers' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL for profile image' })
  profile_image?: string;
}
