import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'I am a software engineer' })
  @IsString()
  @IsOptional()
  aboutMe?: string;

  @ApiProperty({ example: '#000000' })
  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @ApiProperty({ example: { city: 'New York', state: 'NY' } })
  @IsOptional()
  location?: {
    city?: string;
    state?: string;
  };

  @ApiProperty({ example: '1990-01-01' })
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({
    example: [{ type: 'twitter', link: 'https://twitter.com/user' }],
  })
  @IsOptional()
  socialMediaLinks?: { type: string; link: string }[];
}
