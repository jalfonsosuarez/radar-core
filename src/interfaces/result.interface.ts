import { Coordinates } from './coordinates.interface';

export interface Result {
  ok: boolean;
  message?: boolean;
  position: Coordinates;
}
