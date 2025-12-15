import {
  GameOverCode,
  GameOverTitle,
  GameOverMessage,
  Pages,
  Modes,
} from '../types/constants';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { IHintPair, TSelectCell } from '../types/game-types';
import { computed } from '@angular/core';

export interface IGameCounters {
  time: number;
  moves: number;
  score: number;
  hints: number;
  reverts: number;
  adds: number;
  shuffles: number;
  erasers: number;
}

interface IGameState {
  mode: Modes;
  cells: number[][];
  canHover: boolean;
  firstCell: TSelectCell;
  secondCell: TSelectCell;
  errorCell: TSelectCell;
  eraserMode: boolean;
  hintPair: IHintPair | null;
  play: boolean;
  nextIndex: number;
}

interface IState {
  pageIndex: Pages;
  showResults: boolean;
  gameOverCode: GameOverCode;
  gameCounters: IGameCounters;
  gameState: IGameState;
}

export const defaultGameCounters: IGameCounters = {
  time: 0,
  moves: 0,
  score: 0,
  hints: 0,
  reverts: 0,
  adds: 10,
  shuffles: 5,
  erasers: 5,
};

const defaultGameState: IGameState = {
  mode: Modes.CLASSIC,
  cells: [],
  canHover: true,
  firstCell: null,
  secondCell: null,
  errorCell: null,
  eraserMode: false,
  hintPair: null,
  play: false,
  nextIndex: 0,
};

const initialState: IState = {
  pageIndex: Pages.START,
  showResults: false,
  gameOverCode: GameOverCode.WIN,
  gameCounters: defaultGameCounters,
  gameState: defaultGameState,
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
    setShowResults(showResults: boolean): void {
      patchState(store, { showResults });
    },
    setGameOverCode(gameOverCode: GameOverCode): void {
      patchState(store, { gameOverCode });
    },
    setTime(time: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, time },
      }));
    },
    setMoves(moves: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, moves },
      }));
    },
    setScore(score: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, score },
      }));
    },
    setHints(hints: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, hints },
      }));
    },
    setReverts(reverts: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, reverts },
      }));
    },
    setAdds(adds: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, adds },
      }));
    },
    setShuffles(shuffles: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, shuffles },
      }));
    },
    setErasers(erasers: number): void {
      patchState(store, (state) => ({
        gameCounters: { ...state.gameCounters, erasers },
      }));
    },
    setMode(mode: Modes): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, mode },
      }));
    },
    setCells(cells: number[][]): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, cells },
      }));
    },
    setCanHover(canHover: boolean): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, canHover },
      }));
    },
    setFirstCell(firstCell: TSelectCell): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, firstCell },
      }));
    },
    setSecondCell(secondCell: TSelectCell): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, secondCell },
      }));
    },
    setErrorCell(errorCell: TSelectCell): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, errorCell },
      }));
    },
    setEraserMode(eraserMode: boolean): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, eraserMode },
      }));
    },
    setHintPair(hintPair: IHintPair | null): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, hintPair },
      }));
    },
    setPlay(play: boolean): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, play },
      }));
    },
    setNextIndex(nextIndex: number): void {
      patchState(store, (state) => ({
        gameState: { ...state.gameState, nextIndex },
      }));
    },
    resetGame(): void {
      patchState(store, (state) => ({
        gameCounters: defaultGameCounters,
        gameState: { ...state.gameState, firstCell: null, eraserMode: false },
      }));
    },
  })),
);
