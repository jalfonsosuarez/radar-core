import { Scan } from './scan.interface';

export enum ProtocolType {
  closestEnemies = 'closest-enemies',
  furthestEnemies = 'furthest-enemies',
  assistAllies = 'assist-allies',
  avoidCrossfire = 'avoid-crossfire',
  prioritizeMech = 'prioritize-mech',
  avoidMech = 'avoid-mech',
}

export interface Radar {
  protocols: ProtocolType[];
  scan: Scan[];
}
