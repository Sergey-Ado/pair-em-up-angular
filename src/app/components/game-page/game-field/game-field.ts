import { Component, inject } from '@angular/core';
import { GameCell } from './game-cell/game-cell';
import { Store } from '../../../store/store';
import { BorderCell } from './border-cell/border-cell';

@Component({
  selector: 'app-game-field',
  imports: [GameCell, BorderCell],
  templateUrl: './game-field.html',
})
export class GameField {
  protected readonly store = inject(Store);
}
