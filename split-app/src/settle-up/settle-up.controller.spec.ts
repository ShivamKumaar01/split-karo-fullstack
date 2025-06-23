import { Test, TestingModule } from '@nestjs/testing';
import { SettleUpController } from './settle-up.controller';
import { SettleUpService } from './settle-up.service';

describe('SettleUpController', () => {
  let controller: SettleUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettleUpController],
      providers: [SettleUpService],
    }).compile();

    controller = module.get<SettleUpController>(SettleUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
