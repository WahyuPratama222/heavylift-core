import { Test, TestingModule } from '@nestjs/testing';
import { PackageCategoriesService } from './package-categories.service';

describe('PackageCategoriesService', () => {
  let service: PackageCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackageCategoriesService],
    }).compile();

    service = module.get<PackageCategoriesService>(PackageCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
