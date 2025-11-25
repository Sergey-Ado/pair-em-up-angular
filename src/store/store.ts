import { Pages } from '../app/constants';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface IState {
  pageIndex: Pages;
  time: number;
  score: number;
  hints: number;
  reverts: number;
  adds: number;
  shuffles: number;
  erasers: number;
  cells: number[][];
  canHover: boolean;
}

const initialState: IState = {
  pageIndex: Pages.START,
  time: 0,
  score: 0,
  hints: 0,
  reverts: 0,
  adds: 0,
  shuffles: 0,
  erasers: 0,
  cells: [],
  canHover: true,
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setPageIndex(pageIndex: Pages): void {
      patchState(store, { pageIndex });
    },
    setTime(time: number): void {
      patchState(store, { time });
    },
    setScore(score: number): void {
      patchState(store, { score });
    },
    setHints(hints: number): void {
      patchState(store, { hints });
    },
    setReverts(reverts: number): void {
      patchState(store, { reverts });
    },
    setAdds(adds: number): void {
      patchState(store, { adds });
    },
    setShuffles(shuffles: number): void {
      patchState(store, { shuffles });
    },
    setErasers(erasers: number): void {
      patchState(store, { erasers });
    },
    setCells(cells: number[][]): void {
      patchState(store, { cells });
    },
    setCanHover(canHover: boolean): void {
      patchState(store, { canHover });
    },
  })),
);
