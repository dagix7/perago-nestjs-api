import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, IsNull } from 'typeorm';
import { Position } from './entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly repo: TreeRepository<Position>,
  ) {}

  async create(dto: CreatePositionDto) {
    // 1. Handle CEO/Root logic
    if (!dto.parentId) {
      const rootExists = await this.repo.findOne({ where: { parent: IsNull() } });
      if (rootExists) {
        throw new BadRequestException('Organizational structure already has a CEO/Root.');
      }
    }

    const position = new Position();
    position.name = dto.name;
    position.description = dto.description;

    // 2. Link Parent if provided
    if (dto.parentId) {
      const parent = await this.repo.findOne({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent position not found');
      position.parent = parent;
    }

    return this.repo.save(position);
  }

  // This returns the nested tree structure for your frontend
  async findAll() {
    return this.repo.findTrees();
  }

  async findOne(id: string) {
    const pos = await this.repo.findOne({ where: { id } });
    if (!pos) throw new NotFoundException('Position not found');
    return pos;
  }

  async remove(id: string) {
    const pos = await this.findOne(id);
    return this.repo.remove(pos);
  }
}