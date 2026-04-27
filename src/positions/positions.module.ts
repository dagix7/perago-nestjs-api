import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Add this
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { Position } from './entities/position.entity'; // Import your entity

@Module({
  imports: [
    // This line "connects" the Position entity to this specific module
    TypeOrmModule.forFeature([Position]) 
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
  // If you want other modules to use this service, you'd add exports: [PositionsService]
})
export class PositionsModule {}