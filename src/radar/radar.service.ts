import { Injectable } from '@nestjs/common';
import { Coordinates } from '../interfaces/coordinates.interface';

@Injectable()
export class RadarService {
  calculateDistance({ x, y }: Coordinates): number {
    const distance: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return distance;
  }
}
