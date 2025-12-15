import { defaultGameCounters, IGameCounters } from '../store/store';
import { Modes } from './constants';

export interface StorageGameData {
  mode: Modes;
  counters: IGameCounters;
  cells: number[][];
  nextIndex: number;
}

export const defaultStorageGameData: StorageGameData = {
  mode: Modes.CLASSIC,
  counters: defaultGameCounters,
  cells: [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 1, 1, 2, 1, 3, 1, 4, 1],
    [5, 1, 6, 1, 7, 1, 8, 1, 9],
  ],
  nextIndex: 0,
};

export interface StorageHighScoreData {
  mode: string;
  score: number;
  win: boolean;
  time: number;
  moves: number;
}
