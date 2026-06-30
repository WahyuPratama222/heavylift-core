import { Test, TestingModule } from '@nestjs/testing';
import { PackageCategoriesController } from './package-categories.controller';

describe('PackageCategoriesController', () => {
  let controller: PackageCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackageCategoriesController],
    }).compile();

    controller = module.get<PackageCategoriesController>(PackageCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
