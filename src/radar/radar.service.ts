import { Injectable } from '@nestjs/common';
import { Coordinates } from '@interfaces/coordinates.interface';
import { ProtocolType, Radar } from '@interfaces/radar.interface';
import { Result } from '@interfaces/result.interface';
import { Scan } from '@interfaces/scan.interface';
import { EnemieType } from '@interfaces/enemie.interface';
import { Options } from '@interfaces/oprions.intarface';

@Injectable()
export class RadarService {
  calculateDistance({ x, y }: Coordinates): number {
    const distance: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return distance;
  }

  getObjetive({ protocols, scan }: Radar): Coordinates {
    let result: Result = null;
    const options: Options = {
      isClosest: false,
      isFurthest: false,
      isAlies: false,
      isCrossfile: false,
      isMech: false,
      isAvoid: false,
    };

    options.isClosest = protocols.includes(ProtocolType.closestEnemies);
    options.isFurthest = protocols.includes(ProtocolType.furthestEnemies);
    options.isAlies = protocols.includes(ProtocolType.assistAllies);
    options.isCrossfile = protocols.includes(ProtocolType.avoidCrossfire);
    options.isMech = protocols.includes(ProtocolType.prioritizeMech);
    options.isAvoid = protocols.includes(ProtocolType.avoidMech);

    result = this.getPoint(scan, options);

    return result.ok ? result.position : { x: 0, y: 0 };
  }

  getPoint(
    scans: Scan[],
    { isClosest, isFurthest, isAlies, isCrossfile, isMech, isAvoid }: Options,
  ): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };

    let distance = isClosest && !isFurthest ? 100 : 0;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);

      if (dist > 100) continue;

      if (!isAlies && isCrossfile && scan.allies) continue;
      if (isMech && !isAvoid && scan.enemies.type !== EnemieType.mech) continue;

      console.log(scan);

      if (isClosest && dist < distance) {
        result.ok = true;
        result.position = scan.coordinates;
        distance = dist;
      }
      if ((!isClosest || (!isClosest && !isFurthest))  && dist > distance) {
        result.ok = true;
        result.position = scan.coordinates;
        distance = dist;
      }
    }

    console.log(result);

    return result;
  }

  getObjetive2({ protocols, scan }: Radar): Coordinates {
    let result: Result;

    console.log(protocols);

    if (
      protocols.includes(ProtocolType.closestEnemies) &&
      protocols.includes(ProtocolType.prioritizeMech) &&
      protocols.includes(ProtocolType.avoidCrossfire)
    ) {
      console.log(ProtocolType.prioritizeMech);
      result = this.getPrioritizeMechPoint(scan, false, false);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (
      protocols.includes(ProtocolType.closestEnemies) &&
      protocols.includes(ProtocolType.prioritizeMech)
    ) {
      console.log(ProtocolType.prioritizeMech);
      result = this.getPrioritizeMechPoint(scan, false, true);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.assistAllies)) {
      console.log(ProtocolType.assistAllies);
      result = this.getAssistAlliesPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.avoidCrossfire)) {
      console.log(ProtocolType.avoidCrossfire);
      result = this.getAvoidCrossFirePoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (
      protocols.includes(ProtocolType.furthestEnemies) &&
      protocols.includes(ProtocolType.avoidMech)
    ) {
      console.log('2', ProtocolType.avoidMech, ProtocolType.furthestEnemies);
      result = this.getAvoidMechPoint(scan, true);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.avoidMech)) {
      console.log('1', ProtocolType.avoidMech);
      result = this.getAvoidMechPoint(scan, false);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.prioritizeMech)) {
      console.log(ProtocolType.prioritizeMech);
      result = this.getPrioritizeMechPoint(scan, false, true);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.closestEnemies)) {
      console.log(ProtocolType.closestEnemies);
      result = this.getClosestEnemiesPoint(scan);
      return result.ok ? result.position : { x: 0, y: 0 };
    }

    if (protocols.includes(ProtocolType.furthestEnemies)) {
      console.log(ProtocolType.furthestEnemies);
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
      if (!scan.allies) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist < 100) {
          if (dist < distance) {
            result.ok = true;
            result.position = scan.coordinates;

            distance = dist;
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
          result.ok = true;
          result.position = scan.coordinates;
          distance = dist;
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

    let distance = 0;

    for (const scan of scans) {
      const dist = this.calculateDistance(scan.coordinates);
      if (dist < 100) {
        if (dist > distance) {
          result.ok = true;
          result.position = scan.coordinates;
          distance = dist;
        }
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
      if (!isAlies && scan.allies) continue;
      if (scan.enemies.type === EnemieType.mech) {
        if (dist < 100) {
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
    }

    return result;
  }

  getAvoidMechPoint(scans: Scan[], isFurthest: boolean): Result {
    const result = {
      ok: false,
      position: { x: 0, y: 0 },
    };
    console.log('Avoid-mech function');
    let distance = isFurthest ? 0 : 100;

    for (const scan of scans) {
      if (scan.enemies.type !== EnemieType.mech) {
        const dist = this.calculateDistance(scan.coordinates);
        if (dist < 100) {
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
    }

    return result;
  }
}
