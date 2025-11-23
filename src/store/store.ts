import { Pages } from '../app/constants';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface IState {
  pageIndex: Pages;
  time: number;
  score: number;
}

const initialState: IState = {
  pageIndex: Pages.START,
  time: 0,
  score: 0,
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
  })),
);
