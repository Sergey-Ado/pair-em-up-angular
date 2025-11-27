import {
  GameOverCode,
  GameOverTitle,
  GameOverMessage,
  Pages,
} from '../app/types/constants';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { IHintPair, TSelectCell } from '../app/types/game-types';
import { computed } from '@angular/core';

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
  firstCell: TSelectCell;
  secondCell: TSelectCell;
  errorCell: TSelectCell;
  background: string;
  eraserMode: boolean;
  hintPair: IHintPair | null;
  showResults: boolean;
  gameOverCode: GameOverCode;
}

const initialState: IState = {
  pageIndex: Pages.START,
  time: 0,
  score: 0,
  hints: 0,
  reverts: 0,
  adds: 10,
  shuffles: 5,
  erasers: 5,
  cells: [],
  canHover: true,
  firstCell: null,
  secondCell: null,
  errorCell: null,
  background: '',
  eraserMode: false,
  hintPair: null,
  showResults: false,
  gameOverCode: GameOverCode.WIN,
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ gameOverCode }) => ({
    title: computed(() =>
      gameOverCode() === GameOverCode.WIN
        ? GameOverTitle.WIN
        : GameOverTitle.LOSS,
    ),
    message: computed(() => {
      switch (gameOverCode()) {
        case GameOverCode.WIN:
          return GameOverMessage.WIN;
        case GameOverCode.NO_MOVE:
          return GameOverMessage.NO_MOVE;
        default:
          return GameOverMessage.LIMIT;
      }
    }),
  })),
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
    setFirstCell(firstCell: TSelectCell): void {
      patchState(store, { firstCell });
    },
    setSecondCell(secondCell: TSelectCell): void {
      patchState(store, { secondCell });
    },
    setErrorCell(errorCell: TSelectCell): void {
      patchState(store, { errorCell });
    },
    setEraserMode(eraserMode: boolean): void {
      patchState(store, { eraserMode });
    },
    setBackground(background: string): void {
      patchState(store, { background });
    },
    setHintPair(hintPair: IHintPair | null): void {
      patchState(store, { hintPair });
    },
    setShowResults(showResults: boolean): void {
      patchState(store, { showResults });
    },
    setGameOverCode(gameOverCode: GameOverCode): void {
      patchState(store, { gameOverCode });
    },
  })),
);
