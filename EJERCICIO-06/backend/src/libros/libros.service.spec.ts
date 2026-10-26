import { Test, TestingModule } from '@nestjs/testing';
import { LibrosService } from './libros.service.js';

describe('LibrosService', () => {
  let service: LibrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibrosService],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
