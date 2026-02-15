export type GameState = 
  | 'MENU' 
  | 'INTRO_STORY'
  | 'HIDING_INTRO'
  | 'HIDING_GAME'
  | 'DICE_ROLL'
  | 'LEVEL_1_INTRO'
  | 'LEVEL_1_GAME' 
  | 'LEVEL_2_INTRO'
  | 'LEVEL_2_GAME' 
  | 'LEVEL_3_INTRO'
  | 'LEVEL_3_GAME'
  | 'FINAL_BOSS_INTRO'
  | 'FINAL_BOSS_GAME'
  | 'VICTORY';

export type Player = 'Spieler 1' | 'Spieler 2';

export interface Scores {
  p1: number;
  p2: number;
}

export interface DiceEffect {
  label: string;
  effect: 'bonus' | 'malus' | 'neutral';
  description: string;
}