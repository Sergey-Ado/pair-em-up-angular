import { Pages } from '../app/constants';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface IState {
  pageIndex: Pages;
}

const initialState: IState = {
  pageIndex: Pages.START,
};

export const Store = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setPageIndex(index: Pages): void {
      patchState(store, { pageIndex: index });
    },
  })),
);
