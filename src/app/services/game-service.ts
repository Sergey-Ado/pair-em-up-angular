import { Injectable } from '@angular/core';
import { Modes } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  mode = Modes.CLASSIC;

  setMode(mode: Modes) {
    this.mode = mode;
  }
}
