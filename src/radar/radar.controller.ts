import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Coordinates } from '../interfaces/coordinates.interface';
import { Radar } from '@interfaces/radar.interface';
import { providers } from '@config/providers.constants';
import { RadarService } from './radar.service';

@Controller('radar')
export class RadarController {
  constructor(
    @Inject(providers.radarService)
    protected readonly radarService: RadarService,
  ) {}

  @Post()
  receiveRadarPositions(@Body() radarPositions: Radar[]): Coordinates {
    console.log(radarPositions);
    const coordinates = this.radarService.getObjetive(radarPositions);
    return coordinates;
  }
}
