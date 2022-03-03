import { Coordinates } from './coordinates.interface';
import { Enemie } from './enemie.interface';
export interface Scan {
  coordinates: Coordinates;
  enemies: Enemie;
  allies?: number;
}
