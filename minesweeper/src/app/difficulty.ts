export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
  }
  
  export interface GameConfig {
    rows: number;
    cols: number;
    mines: number;
  }
  
  export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
    [Difficulty.EASY]: { rows: 9, cols: 9, mines: 10 },
    [Difficulty.MEDIUM]: { rows: 16, cols: 16, mines: 40 },
    [Difficulty.HARD]: { rows: 16, cols: 30, mines: 99 }
  };