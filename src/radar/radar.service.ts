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
    let result: Result;

    if (
      protocols.includes(ProtocolType.closestEnemies) &&
      protocols.includes(ProtocolType.prioritizeMech) &&
      protocols.includes(ProtocolType.avoidCrossfire)
    ) {
      result = this.getPrioritizeMechPoint(scan, false, false);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (
      protocols.includes(ProtocolType.closestEnemies) &&
      protocols.includes(ProtocolType.prioritizeMech)
    ) {
      result = this.getPrioritizeMechPoint(scan, false, true);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.assistAllies)) {
      result = this.getAssistAlliesPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.avoidCrossfire)) {
      result = this.getAvoidCrossFirePoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (
      protocols.includes(ProtocolType.furthestEnemies) &&
      protocols.includes(ProtocolType.avoidMech)
    ) {
      result = this.getAvoidMechPoint(scan, true);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.avoidMech)) {
      result = this.getAvoidMechPoint(scan, false);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.prioritizeMech)) {
      result = this.getPrioritizeMechPoint(scan, false, true);
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
  }

  getAssistAlliesPoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };
    let distance = 100;

    for (const scan of scans) {
      if (scan.allies > 0) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist > 100) continue;
        if (dist < distance) {
          distance = dist;
          result.ok = true;
          result.position = scan.coordinates;
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
      if (!scan.allies) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist > 100) continue;
        if (dist < distance) {
          result.ok = true;
          result.position = scan.coordinates;

          distance = dist;
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
      if (dist > 100) continue;
      if (dist < distance) {
        result.ok = true;
        result.position = scan.coordinates;
        distance = dist;
      }
    }

    return result;
  }

  getFurthestEnemiesPoint(scans: Scan[]): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = 0;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist > 100) continue;
      if (dist > distance) {
        result.ok = true;
        result.position = scan.coordinates;
        distance = dist;
      }
    }

    return result;
  }

  getPrioritizeMechPoint(
    scans: Scan[],
    isFurthest: boolean,
    isAlies: boolean,
  ): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = isFurthest ? 0 : 100;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist > 100) continue;
      if (!isAlies && scan.allies) continue;
      if (scan.enemies.type === EnemieType.mech) {
        if (!isFurthest && dist < distance) {
          result.ok = true;
          result.position = scan.coordinates;
          distance = dist;
        }
        if (isFurthest && dist > distance) {
          result.ok = true;
          result.position = scan.coordinates;
          distance = dist;
        }
      }
    }

    return result;
  }

  getAvoidMechPoint(scans: Scan[], isFurthest: boolean): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };
    let distance = isFurthest ? 0 : 100;

    for (const scan of scans) {
      if (scan.enemies.type !== EnemieType.mech) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist > 100) continue;

        if (!isFurthest && dist < distance) {
          result.ok = true;
          result.position = scan.coordinates;
          distance = dist;
        }
        if (isFurthest && dist > distance) {
          result.ok = true;
          result.position = scan.coordinates;
          distance = dist;
        }
      }
    }

    return result;
  }
}
