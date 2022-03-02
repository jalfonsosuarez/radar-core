import { Injectable } from '@nestjs/common';
import { Coordinates } from '@interfaces/coordinates.interface';
import { ProtocolType, Radar } from '@interfaces/radar.interface';
import { Result } from '@interfaces/result.interface';
import { Scan } from '@interfaces/scan.interface';
import { Enemie, EnemieType } from '../../dist/interfaces/enemie.interface';

@Injectable()
export class RadarService {
  calculateDistance({ x, y }: Coordinates): number {
    const distance: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return distance;
  }

  getObjetive({ protocols, scan }: Radar): Coordinates {
    let result: Result;

    if (protocols.includes(ProtocolType.assistAllies)) {
      result = this.getAssistAlliesPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.avoidCrossfire)) {
      result = this.getAvoidCrossFirePoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.closestEnemies)) {
      result = this.getClosestEnemiesPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.furthestEnemies)) {
      result = this.getFurthestEnemiesPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.prioritizeMech)) {
      result = this.getPrioritizeMechPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.avoidMech)) {
      result = this.getAvoidMechPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }
  }

  getAssistAlliesPoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = 100;

    for (const scan of scans) {
      if (scan.enemie.allies) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist < 100) {
          if (dist < distance) {
            distance = dist;
            result.ok = true;
            result.position = scan.coordinates;
          }
        }
      }
    }

    return result;
  }

  getAvoidCrossFirePoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = 100;

    for (const scan of scans) {
      if (!scan.enemie.allies) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist < 100) {
          if (dist < distance) {
            distance = dist;
            result.ok = true;
            result.position = scan.coordinates;
          }
        }
      }
    }
    return result;
  }

  getClosestEnemiesPoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = 100;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist < 100) {
        if (dist < distance) {
          distance = dist;
          result.ok = true;
          result.position = scan.coordinates;
        }
      }
    }

    return result;
  }

  getFurthestEnemiesPoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = 100;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist < 100) {
        if (dist > distance) {
          distance = dist;
          result.ok = true;
          result.position = scan.coordinates;
        }
      }
    }

    return result;
  }

  getPrioritizeMechPoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist < 100) {
        if (scan.enemie.type === EnemieType.mech) {
          result.ok = true;
          result.position = scan.coordinates;
          break;
        }
      }
    }

    return result;
  }

  getAvoidMechPoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = 100;

    for (const scan of scans) {
      if (scan.enemie.type !== EnemieType.mech) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist < 100) {
          if (dist < distance) {
            distance = dist;
            result.ok = true;
            result.position = scan.coordinates;
          }
        }
      }
    }

    return result;
  }
}
