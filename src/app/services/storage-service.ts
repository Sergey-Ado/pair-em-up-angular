import { inject, Injectable } from '@angular/core';
import { IGameCounters, Store } from '../store/store';
import { Modes, StorageKeys } from '../types/constants';
import {
  defaultStorageGameData,
  StorageGameData,
  StorageHighScoreData,
} from '../types/storage-types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private store = inject(Store);

  public saveHighScores(): void {
    // const highScores = this.loadHighScores();
    const highScores = [];

    const newHighScore: StorageHighScoreData = {
      mode: this.store.gameState.mode(),
      score: this.store.gameCounters.score(),
      win: !this.store.gameOverCode(),
      time: this.store.gameCounters.time(),
      moves: this.store.gameCounters.moves(),
    };
    highScores.push(newHighScore);
    highScores.sort((a, b) => a.time - b.time);
    if (highScores.length > 5) highScores.pop();
    const json = JSON.stringify(highScores);
    localStorage.setItem(StorageKeys.HIGH_SCORES, json);
  }

  public saveGame(): void {
    if (!this.store.gameState.play()) return;
    const counters: IGameCounters = {
      score: this.store.gameCounters.score(),
      time: this.store.gameCounters.time(),
      moves: this.store.gameCounters.moves(),
      hints: this.store.gameCounters.hints(),
      reverts: this.store.gameCounters.reverts(),
      adds: this.store.gameCounters.adds(),
      shuffles: this.store.gameCounters.shuffles(),
      erasers: this.store.gameCounters.erasers(),
    };

    const data: StorageGameData = {
      mode: this.store.gameState.mode(),
      counters,
      cells: this.store.gameState.cells(),
      nextIndex: this.store.gameState.nextIndex(),
    };

    const json = JSON.stringify(data);

    localStorage.setItem(StorageKeys.GAME, json);
  }

  public loadGame(): number[][] {
    const json = localStorage.getItem(StorageKeys.GAME);
    if (!json) return this.setLoadGame(defaultStorageGameData);

    const dataFromJSON: unknown = JSON.parse(json);
    if (typeof dataFromJSON === 'object' && dataFromJSON) {
      const tempObject: Partial<StorageGameData> = dataFromJSON;

      if (
        typeof tempObject.mode === 'string' &&
        typeof tempObject.nextIndex === 'number' &&
        typeof tempObject.counters &&
        tempObject.counters &&
        Array.isArray(tempObject.cells)
      ) {
        const mode: Modes = tempObject.mode;
        const nextIndex = tempObject.nextIndex;
        const tempCounters: Partial<IGameCounters> = tempObject.counters;
        const cells = tempObject.cells;
        const counters = this.parseCounters(tempCounters);
        if (counters) {
          return this.setLoadGame({ mode, nextIndex, cells, counters });
        }
      }
    }

    return this.setLoadGame(defaultStorageGameData);
  }

  private parseCounters(
    tempCounters: Partial<IGameCounters>,
  ): IGameCounters | null {
    if (
      typeof tempCounters.time === 'number' &&
      typeof tempCounters.moves === 'number' &&
      typeof tempCounters.score === 'number' &&
      typeof tempCounters.hints === 'number' &&
      typeof tempCounters.reverts === 'number' &&
      typeof tempCounters.adds === 'number' &&
      typeof tempCounters.shuffles === 'number' &&
      typeof tempCounters.erasers === 'number'
    ) {
      return {
        time: tempCounters.time,
        moves: tempCounters.moves,
        score: tempCounters.score,
        hints: tempCounters.hints,
        reverts: tempCounters.reverts,
        adds: tempCounters.adds,
        shuffles: tempCounters.shuffles,
        erasers: tempCounters.erasers,
      };
    }
    return null;
  }

  private setLoadGame(data: StorageGameData): number[][] {
    this.store.setMode(data.mode);
    this.store.setNextIndex(data.nextIndex);
    this.store.setCells(data.cells);

    this.store.setTime(data.counters.time);
    this.store.setMoves(data.counters.moves);
    this.store.setScore(data.counters.score);
    this.store.setHints(data.counters.hints);
    this.store.setReverts(data.counters.reverts);
    this.store.setAdds(data.counters.adds);
    this.store.setShuffles(data.counters.shuffles);
    this.store.setErasers(data.counters.erasers);

    return data.cells;
  }

  public hasGame(): boolean {
    const result = Boolean(localStorage.getItem(StorageKeys.GAME));
    return result;
  }
}
