import { Component, computed, inject, input, OnChanges } from '@angular/core';
import { Store } from '../../../../../store/store';
import { NgClass } from '@angular/common';
import { GameService } from '../../../../services/game-service';
import { ICell } from '../../../../types/game-types';

@Component({
  selector: 'app-game-cell',
  imports: [NgClass],
  templateUrl: './game-cell.html',
  styleUrl: './game-cell.css',
})
export class GameCell implements OnChanges {
  public row = input<string>();
  public col = input<string>();
  public value = input<string>();
  private store = inject(Store);
  private gameService = inject(GameService);
  private cell: ICell = { row: -1, col: -1, value: -1 };

  protected class = computed(() => {
    const classes = ['game-cell'];
    if (this.store.canHover()) classes.push('can-hover');

    let cell = this.store.firstCell();
    if (cell === this.cell) classes.push('active');
    cell = this.store.secondCell();
    if (cell === this.cell) classes.push('active');
    cell = this.store.errorCell();
    if (cell === this.cell) classes.push('error');

    const hintPair = this.store.hintPair();
    if (hintPair) {
      hintPair.forEach((cell) => {
        if (cell.row === this.cell.row && cell.col === this.cell.col) {
          classes.push('hint');
        }
      });
    }

    return classes.join(' ');
  });

  protected content = computed(() => {
    const value = this.value();
    return +(value || -1) > 0 ? value : '';
  });

  public ngOnChanges(): void {
    this.cell = {
      row: +(this.row() || -1),
      col: +(this.col() || -1),
      value: +(this.value() || -1),
    };
  }

  protected click(): void {
    if (this.cell.value === 0) return;
    this.gameService.getCellSignal(this.cell);
  }
}
