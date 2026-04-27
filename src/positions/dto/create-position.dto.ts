import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @ApiProperty({ example: 'CTO' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Head of Technology', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'uuid-of-parent-here', required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}