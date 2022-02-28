export enum EnemieType {
  soldier = 'soldier',
  mech = 'mech',
}

export interface Enemie {
  type: EnemieType;
  number: number;
  allies?: number;
}
