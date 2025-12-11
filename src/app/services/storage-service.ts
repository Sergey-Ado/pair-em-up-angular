import { inject, Injectable } from '@angular/core';
import { Store } from '../../store/store';
import { StorageKeys } from '../types/constants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private store = inject(Store);

  public saveGame(): void {
    if (!this.store.gameState.play()) return;
    const counters = {
      score: this.store.gameCounters.score(),
      time: this.store.gameCounters.time(),
      moves: this.store.gameCounters.moves(),
      hints: this.store.gameCounters.hints(),
      reverts: this.store.gameCounters.reverts(),
      adds: this.store.gameCounters.adds(),
      shuffles: this.store.gameCounters.shuffles(),
      erasers: this.store.gameCounters.erasers(),
      nextIndex: this.store.gameState.nextIndex(),
    };

    const data = {
      mode: this.store.gameState.mode(),
      counters,
      cells: this.store.gameState.cells(),
    };

    const json = JSON.stringify(data);

    localStorage.setItem(StorageKeys.GAME, json);
  }
}
