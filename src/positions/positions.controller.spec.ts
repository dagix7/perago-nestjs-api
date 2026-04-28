import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findChildren: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('PositionsController', () => {
  let controller: PositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [{ provide: PositionsService, useValue: mockService }],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a position', async () => {
      const dto = { name: 'CEO', description: 'Root position' };
      const result = { id: 'uuid-1', ...dto };
      mockService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw if root already exists', async () => {
      mockService.create.mockRejectedValue(new BadRequestException());
      await expect(controller.create({ name: 'CEO' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return the full tree', async () => {
      const tree = [{ id: 'uuid-1', name: 'CEO', children: [] }];
      mockService.findAll.mockResolvedValue(tree);
      expect(await controller.findAll()).toEqual(tree);
    });
  });

  describe('findOne', () => {
    it('should return a single position', async () => {
      const pos = { id: 'uuid-1', name: 'CEO' };
      mockService.findOne.mockResolvedValue(pos);
      expect(await controller.findOne('uuid-1')).toEqual(pos);
    });

    it('should throw NotFoundException for unknown id', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findChildren', () => {
    it('should return direct children of a position', async () => {
      const children = [{ id: 'uuid-2', name: 'CTO' }];
      mockService.findChildren.mockResolvedValue(children);
      expect(await controller.findChildren('uuid-1')).toEqual(children);
    });
  });

  describe('update', () => {
    it('should update a position', async () => {
      const dto = { name: 'Updated CEO' };
      const result = { id: 'uuid-1', name: 'Updated CEO' };
      mockService.update.mockResolvedValue(result);
      expect(await controller.update('uuid-1', dto)).toEqual(result);
    });

    it('should throw NotFoundException for unknown id', async () => {
      mockService.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update('bad-id', { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a position', async () => {
      mockService.remove.mockResolvedValue({ id: 'uuid-1', name: 'CEO' });
      expect(await controller.remove('uuid-1')).toHaveProperty('id');
    });

    it('should throw ConflictException if position has children', async () => {
      mockService.remove.mockRejectedValue(new ConflictException());
      await expect(controller.remove('uuid-1')).rejects.toThrow(ConflictException);
    });
  });
});
