import { Body, Controller, Post } from '@nestjs/common';
import { Coordinates } from '../interfaces/coordinates.interface';
import { Radar } from '@interfaces/radar.interface';
import { RadarService } from './radar.service';

@Controller('radar')
export class RadarController {
  constructor(protected readonly radarService: RadarService) {}

  @Post()
  receiveRadarPositions(@Body() radarPositions: Radar): Coordinates {
    let coordinates: Coordinates = null;
    coordinates = this.radarService.getObjetive(radarPositions);
    return coordinates;
  }
}
