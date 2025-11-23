import { inject, Injectable } from '@angular/core';
import { Modes } from '../constants';
import { Store } from '../../store/store';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  mode = Modes.CLASSIC;
  readonly store = inject(Store);
  timerIncrement = 0;

  setMode(mode: Modes) {
    this.mode = mode;
  }

  startTimer(time = 0): void {
    this.store.setTime(time);
    if (this.timerIncrement) {
      clearInterval(this.timerIncrement);
    }
    this.timerIncrement = setInterval(() => {
      this.store.setTime(this.store.time() + 1);
      console.log(this.store.time());
    }, 1000);
  }

  newGame(mode: Modes): void {
    this.mode = mode;
    this.startTimer();
  }
}
