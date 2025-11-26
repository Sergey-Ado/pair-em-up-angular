import { inject, Injectable } from '@angular/core';
import { Constants, Modes } from '../types/constants';
import { Store } from '../../store/store';
import { ICell, IHintPair } from '../types/game-types';
import { SoundService } from './sound-service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly store = inject(Store);
  private readonly soundService = inject(SoundService);

  public mode = Modes.CLASSIC;
  private timerIncrement = 0;
  private cells: number[][] = [[0]];
  private nextIndex = 0;
  private play = false;
  private moves = 0;
  private hints: IHintPair[] = [];
  private canClick = true;
  private firstCell: ICell | null = null;
  private secondCell: ICell | null = null;
  private eraserMode = false;

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

    this.createNewCells();

    this.createFirstCells();
    this.updateStoreCells();

    this.clearCounters();
    this.calculateHints();
    this.play = true;
    this.soundService.start();
    // globalStore.sound.startBackground();
    this.soundService.start();
  }

  private updateStoreCells(): void {
    const countRow = Math.ceil(this.nextIndex / 9);
    const cells = this.cells.slice(0, countRow);
    this.store.setCells(cells);
  }

  private createNewCells(): void {
    this.cells = Array(50)
      .fill(0)
      .map(() => Array(9).fill(0));
    this.nextIndex = 0;
  }

  private createFirstCells(): void {
    let numbers = [];
    if (this.mode === 'chaotic') {
      for (let i = 0; i < 27; i++) {
        numbers.push(Math.floor(9 * Math.random()) + 1);
      }
    } else {
      numbers = Array(19)
        .fill(0)
        .map((_, i) => i + 1)
        .filter((s) => s !== 10)
        .join('')
        .split('');
      if (this.mode === 'random') {
        numbers.sort(() => Math.random() - 0.5);
      }
    }
    numbers.forEach((s) => this.setNextValue(+s));
  }

  private setNextValue(value: number): void {
    const i = Math.floor(this.nextIndex / 9);
    const j = this.nextIndex % 9;
    this.cells[i][j] = value;
    this.nextIndex++;
  }

  private clearCounters(): void {
    this.store.setScore(0);
    this.moves = 0;

    this.store.setHints(0);
    this.store.setReverts(0);
    this.store.setAdds(0);
    this.store.setShuffles(0);
    this.store.setErasers(0);
  }

  private calculateHints(): void {
    this.hints = [];
    const horizontal = this.cells
      .flat()
      .map((item, index) => {
        return { row: Math.floor(index / 9), col: index % 9, value: item };
      })
      .filter((item) => item.value);
    for (let i = 0; i < horizontal.length - 1; i++) {
      const pairValue = this.pairValue(
        horizontal[i].value,
        horizontal[i + 1].value,
      );
      if (pairValue) this.hints.push([horizontal[i], horizontal[i + 1]]);
    }

    for (let col = 0; col < 9; col++) {
      const vertical = [];
      for (let row = 0; row < 50; row++) {
        if (this.cells[row][col]) {
          vertical.push({ row, col, value: this.cells[row][col] });
        }
      }
      for (let i = 0; i < vertical.length - 1; i++) {
        const pairValue = this.pairValue(
          vertical[i].value,
          vertical[i + 1].value,
        );
        if (pairValue) this.hints.push([vertical[i], vertical[i + 1]]);
      }
    }
    this.store.setHints(this.hints.length);
  }

  private pairValue(firstValue: number, secondValue: number): number {
    if (firstValue === 5 && secondValue === 5) return 3;
    if (firstValue + secondValue === 10) return 2;
    if (firstValue === secondValue) return 1;
    return 0;
  }

  private pairCellValue(firstCell: ICell, secondCell: ICell): number {
    const firstValue = this.cells[firstCell.row][firstCell.col];
    const secondValue = this.cells[secondCell.row][secondCell.col];
    return this.pairValue(firstValue, secondValue);
  }

  public getCellSignal(cell: ICell): void {
    if (!this.canClick) return;

    if (this.firstCell === null) {
      if (this.eraserMode) {
        // this.endEraserMode();
        this.canClick = false;
        this.firstCell = cell;
        this.store.setFirstCell(cell);
        setTimeout(() => {
          this.canClick = true;
          // this.eraser();
        }, Constants.REMOVE_DELAY);
        return;
      } else {
        this.firstCell = cell;
        this.store.setFirstCell(cell);
        this.soundService.select();
        return;
      }
    }

    if (this.firstCell === cell) {
      this.firstCell = null;
      this.store.setFirstCell(null);
      this.soundService.unselect();
      return;
    }

    this.secondCell = cell;

    const pairValue = this.pairCellValue(this.firstCell, this.secondCell);
    if (pairValue && (this.isHorizontal() || this.isVertical())) {
      this.store.setScore(this.store.score() + pairValue);
      this.store.setReverts(1);
      this.moves++;
      this.removePair();
    } else {
      this.cancelPair();
    }
  }

  private isVertical(): boolean {
    if (!(this.firstCell && this.secondCell)) return false;
    const col = this.firstCell.col;
    if (col !== this.secondCell.col) return false;
    const dRow = this.secondCell.row > this.firstCell.row ? 1 : -1;
    let row = this.firstCell.row + dRow;
    while (this.cells[row][col] === 0) {
      row += dRow;
    }
    return row === this.secondCell.row;
  }

  private isHorizontal(): boolean {
    if (!(this.firstCell && this.secondCell)) return false;
    const dCol =
      (this.firstCell.row === this.secondCell.row &&
        this.firstCell.col < this.secondCell.col) ||
      this.firstCell.row < this.secondCell.row
        ? 1
        : -1;
    let row = this.firstCell.row;
    let col = this.firstCell.col + dCol;
    if (col < 0) {
      row--;
      col = 8;
    }
    if (col > 8) {
      row++;
      col = 0;
    }
    while (this.cells[row][col] === 0) {
      col += dCol;
      if (col < 0) {
        row--;
        col = 8;
      }
      if (col > 8) {
        row++;
        col = 0;
      }
    }
    return row === this.secondCell.row && col === this.secondCell.col;
  }

  private removePair(): void {
    if (!(this.firstCell && this.secondCell)) return;
    this.canClick = false;
    this.store.setSecondCell(this.secondCell);
    this.soundService.remove();
    const removeDelay = setTimeout(() => {
      if (!(this.firstCell && this.secondCell)) return;
      // this.saveOldCells();
      this.cells[this.firstCell.row][this.firstCell.col] = 0;
      this.cells[this.secondCell.row][this.secondCell.col] = 0;
      this.store.setFirstCell(null);
      this.store.setSecondCell(null);
      this.updateStoreCells();
      this.firstCell = null;
      this.secondCell = null;
      clearTimeout(removeDelay);
      this.canClick = true;
      this.calculateHints();
      // this.updateCounters();
      // this.canMove();
    }, Constants.REMOVE_DELAY);
  }

  private cancelPair(): void {
    if (!(this.firstCell && this.secondCell)) return;
    this.canClick = false;
    this.store.setErrorCell(this.secondCell);
    const errorDelay = setTimeout(() => {
      if (!(this.firstCell && this.secondCell)) return;
      this.store.setFirstCell(null);
      this.firstCell = null;
      this.store.setErrorCell(null);
      this.secondCell = null;
      clearTimeout(errorDelay);
      this.canClick = true;
    }, Constants.REMOVE_DELAY);
    this.soundService.error();
  }
}
