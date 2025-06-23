import { Test, TestingModule } from '@nestjs/testing';
import { SettleUpService } from './settle-up.service';

describe('SettleUpService', () => {
  let service: SettleUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettleUpService],
    }).compile();

    service = module.get<SettleUpService>(SettleUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
