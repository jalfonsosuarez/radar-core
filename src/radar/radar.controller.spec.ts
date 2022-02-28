import { Test, TestingModule } from '@nestjs/testing';
import { RadarController } from './radar.controller';

describe('RadarController', () => {
  let controller: RadarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RadarController],
    }).compile();

    controller = module.get<RadarController>(RadarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
