import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new position in the hierarchy' })
  @ApiResponse({ status: 201, description: 'Position created.' })
  @ApiResponse({ status: 400, description: 'Root position already exists or invalid input.' })
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get the full nested organizational tree' })
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single position by ID' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Get direct children of a position' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  findChildren(@Param('id') id: string) {
    return this.positionsService.findChildren(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a position' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a position (only if it has no children)' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  @ApiResponse({ status: 409, description: 'Position has children.' })
  remove(@Param('id') id: string) {
    return this.positionsService.remove(id);
  }
}