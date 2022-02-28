import { Body, Controller, Post } from '@nestjs/common';
import { Coordinates } from '../interfaces/coordinates.interface';
import { Radar } from '../interfaces/radar.interface';

@Controller('radar')
export class RadarController {
  @Post()
  receiveRadarPositions(@Body() radarPositions: Radar[]): Coordinates {
    console.log(radarPositions);
    const coordinates = { x: 0, y: 40 };
    return coordinates;
  }
}
