import { Injectable } from '@nestjs/common';
import { Coordinates } from '@interfaces/coordinates.interface';
import { ProtocolType, Radar } from '@interfaces/radar.interface';
import { Result } from '@interfaces/result.interface';
import { Scan } from '@interfaces/scan.interface';
import { EnemieType } from '@interfaces/enemie.interface';

@Injectable()
export class RadarService {
  calculateDistance({ x, y }: Coordinates): number {
    const distance: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return distance;
  }

  getObjetive({ protocols, scan }: Radar): Coordinates {
    if (
      protocols.includes(ProtocolType.closestEnemies) &&
      protocols.includes(ProtocolType.prioritizeMech) &&
      protocols.includes(ProtocolType.avoidCrossfire)
    ) {
      return this.getPrioritizeMechPoint(scan, false, false);
    }

    if (
      protocols.includes(ProtocolType.closestEnemies) &&
      protocols.includes(ProtocolType.prioritizeMech)
    ) {
      return this.getPrioritizeMechPoint(scan, false, true);
    }

    if (protocols.includes(ProtocolType.assistAllies)) {
      return this.getAssistAlliesPoint(scan);
    }

    if (protocols.includes(ProtocolType.avoidCrossfire)) {
      return this.getAvoidCrossFirePoint(scan);
    }

    if (
      protocols.includes(ProtocolType.furthestEnemies) &&
      protocols.includes(ProtocolType.avoidMech)
    ) {
      return this.getAvoidMechPoint(scan, true);
    }

    if (protocols.includes(ProtocolType.avoidMech)) {
      return this.getAvoidMechPoint(scan, false);
    }

    if (protocols.includes(ProtocolType.prioritizeMech)) {
      return this.getPrioritizeMechPoint(scan, false, true);
    }

    if (protocols.includes(ProtocolType.closestEnemies)) {
      return this.getClosestEnemiesPoint(scan);
    }

    if (protocols.includes(ProtocolType.furthestEnemies)) {
      return this.getFurthestEnemiesPoint(scan);
    }
  }

  getAssistAlliesPoint(scans: Scan[]): Coordinates {
    let result = { x: 0, y: 0 };
    let distance = 100;

    for (const scan of scans) {
      if (scan.allies > 0) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist > 100) continue;
        if (dist < distance) {
          distance = dist;
          result = scan.coordinates;
        }
      }
    }
    return result;
  }

  getAvoidCrossFirePoint(scans: Scan[]): Coordinates {
    let result = { x: 0, y: 0 };
    let distance = 100;

    for (const scan of scans) {
      if (!scan.allies) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist > 100) continue;
        if (dist < distance) {
          result = scan.coordinates;
          distance = dist;
        }
      }
    }
    return result;
  }

  getClosestEnemiesPoint(scans: Scan[]): Coordinates {
    let result = { x: 0, y: 0 };
    let distance = 100;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist > 100) continue;
      if (dist < distance) {
        result = scan.coordinates;
        distance = dist;
      }
    }
    return result;
  }

  getFurthestEnemiesPoint(scans: Scan[]): Coordinates {
    let result = { x: 0, y: 0 };
    let distance = 0;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist > 100) continue;
      if (dist > distance) {
        result = scan.coordinates;
        distance = dist;
      }
    }
    return result;
  }

  getPrioritizeMechPoint(
    scans: Scan[],
    isFurthest: boolean,
    isAlies: boolean,
  ): Coordinates {
    let result = { x: 0, y: 0 };
    let distance = isFurthest ? 0 : 100;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist > 100) continue;
      if (!isAlies && scan.allies) continue;
      if (scan.enemies.type === EnemieType.mech) {
        if (!isFurthest && dist < distance) {
          result = scan.coordinates;
          distance = dist;
        }
        if (isFurthest && dist > distance) {
          result = scan.coordinates;
          distance = dist;
        }
      }
    }
    return result;
  }

  getAvoidMechPoint(scans: Scan[], isFurthest: boolean): Coordinates {
    let result = { x: 0, y: 0 };
    let distance = isFurthest ? 0 : 100;

    for (const scan of scans) {
      if (scan.enemies.type !== EnemieType.mech) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist > 100) continue;
        if (!isFurthest && dist < distance) {
          result = scan.coordinates;
          distance = dist;
        }
        if (isFurthest && dist > distance) {
          result = scan.coordinates;
          distance = dist;
        }
      }
    }
    return result;
  }
}
