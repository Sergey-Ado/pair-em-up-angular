import { defaultGameCounters, IGameCounters } from '../../store/store';
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
  cells: [],
  nextIndex: 0,
};
