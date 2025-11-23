import { inject, Injectable } from '@angular/core';
import { Modes } from '../constants';
import { Store } from '../../store/store';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public mode = Modes.CLASSIC;
  private readonly store = inject(Store);
  private timerIncrement = 0;

  private startTimer(time = 0): void {
    this.store.setTime(time);
    if (this.timerIncrement) {
      clearInterval(this.timerIncrement);
    }
    this.timerIncrement = setInterval(() => {
      this.store.setTime(this.store.time() + 1);
    }, 1000);
  }

  public newGame(mode: Modes): void {
    this.mode = mode;
    this.startTimer();
  }
}
