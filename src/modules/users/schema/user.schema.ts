import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Location {
  @ApiProperty({ example: 'New York', description: 'City of residence' })
  @Prop({ required: true })
  city: string;

  @ApiProperty({ example: 'New York', description: 'State of residence' })
  @Prop({ required: true })
  state: string;
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ _id: false })
class SocialMediaLink {
  @ApiProperty({ example: 'Instagram', description: 'Social media platform' })
  @Prop({ required: true })
  type: string;

  @ApiProperty({
    example: 'https://www.instagram.com/user',
    description: "Link to the user's social media profile",
  })
  @Prop({ required: true })
  link: string;
}

const SocialMediaLinkSchema = SchemaFactory.createForClass(SocialMediaLink);

@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Phone number of the user',
  })
  @Prop()
  phoneNumber?: string;

  @ApiProperty({
    example: 'I am a software engineer',
    description: 'About me of the user',
  })
  @Prop()
  aboutMe?: string;

  @ApiProperty({
    example: '#000000',
    description: 'Background color of the user',
  })
  @Prop()
  backgroundColor?: string;

  @ApiProperty({
    example: { city: 'New York', state: 'NY' },
    description: 'Location of the user',
  })
  @Prop({ type: LocationSchema })
  location?: Location;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth of the user',
  })
  @Prop()
  dateOfBirth?: Date;

  @ApiProperty({
    example: [
      { type: 'Instagram', link: 'https://www.instagram.com/user' },
      { type: 'Facebook', link: 'https://www.facebook.com/user' },
    ],
    description: 'Social media links of the user',
  })
  @Prop({ type: [SocialMediaLinkSchema], default: [] })
  socialMediaLinks: SocialMediaLink[];

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at date of the user',
  })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at date of the user',
  })
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
