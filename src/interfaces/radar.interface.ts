import { Scan } from './scan.interface';

export interface Radar {
  protocols: string[];
  scan: Scan[];
}
