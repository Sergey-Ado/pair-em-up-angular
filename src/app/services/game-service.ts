import { inject, Injectable } from '@angular/core';
import { Constants, GameOverCode, Modes } from '../types/constants';
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
  private oldFirstCell: ICell | null = null;
  private oldSecondCell: ICell | null = null;
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

  private stopTimer(): void {
    if (this.timerIncrement) {
      clearInterval(this.timerIncrement);
    }
  }

  public newGame(mode: Modes | undefined = undefined): void {
    if (mode) {
      this.mode = mode;
    }
    this.startTimer();

    // this.store.setDefaultValue();
    this.createNewCells();

    this.createFirstCells();
    this.updateStoreCells();

    // this.clearCounters();
    this.calculateHints();
    this.play = true;
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
        this.endEraserMode();
        this.canClick = false;
        this.firstCell = cell;
        this.store.setFirstCell(cell);
        setTimeout(() => {
          this.canClick = true;
          this.eraser();
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
      this.saveOldCells();
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
      this.canMove();
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

  public addNumbers(): void {
    // globalStore.burger.close();
    this.endEraserMode();
    let numbers = this.cells.flat().filter((s) => s);
    if (this.mode === 'random') {
      numbers.sort(() => Math.random() - 0.5);
    }
    if (this.mode === 'chaotic') {
      numbers = numbers.map(() => Math.floor(9 * Math.random()) + 1);
    }

    this.soundService.assist();
    for (let i = 0; i < numbers.length; i++) {
      if (this.nextIndex > 449 && i < numbers.length - 1) {
        this.gameOver(GameOverCode.NO_MOVE);
        break;
      }
      this.setNextValue(numbers[i]);
    }

    this.updateStoreCells();

    this.store.setReverts(0);
    this.store.setAdds(this.store.adds() - 1);
    if (this.firstCell) {
      this.store.setFirstCell(null);
      this.firstCell = null;
    }
    this.calculateHints();
    this.canMove();
  }

  public shuffle(): void {
    // globalStore.burger.close();
    this.endEraserMode();
    const numbers = this.cells
      .map((line, i) =>
        line.map((value, j) => {
          return { i, j, value };
        }),
      )
      .flat()
      .filter((item) => item.value);

    const newValue = numbers
      .map((item) => item.value)
      .sort(() => Math.random() - 0.5);
    numbers.forEach(
      (item, index) => (this.cells[item.i][item.j] = newValue[index]),
    );

    this.store.setShuffles(this.store.shuffles() - 1);
    this.store.setReverts(0);
    this.calculateHints();

    if (this.firstCell) {
      this.store.setFirstCell(null);
      this.firstCell = null;
    }

    this.updateStoreCells();
    this.soundService.assist();
    this.canMove();
  }

  public eraser(): void {
    // globalStore.burger.close();
    if (this.firstCell) {
      this.cells[this.firstCell.row][this.firstCell.col] = 0;
      this.store.setFirstCell(null);
      this.firstCell = null;
      this.store.setErasers(this.store.erasers() - 1);
      this.store.setReverts(0);
      this.calculateHints();
      this.updateStoreCells();
      this.soundService.assist();
      this.canMove();
    } else {
      if (this.eraserMode) {
        this.endEraserMode();
      } else {
        this.eraserMode = true;
        this.store.setEraserMode(true);
      }
    }
  }

  private endEraserMode(): void {
    this.eraserMode = false;
    this.store.setEraserMode(false);
  }

  public revert(): void {
    this.endEraserMode();
    // globalStore.burger.close();
    if (this.firstCell) {
      this.store.setFirstCell(null);
      this.firstCell = null;
    }
    if (this.oldFirstCell && this.oldSecondCell) {
      this.cells[this.oldFirstCell!.row][this.oldFirstCell.col] =
        this.oldFirstCell.value;
      this.cells[this.oldSecondCell.row][this.oldSecondCell.col] =
        this.oldSecondCell.value;
      this.updateStoreCells();

      const delta = this.pairCellValue(this.oldFirstCell, this.oldSecondCell);
      this.store.setScore(this.store.score() - delta);
      this.store.setReverts(0);
      this.moves--;
      this.calculateHints();
      this.soundService.assist();
    }
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

  private saveOldCells(): void {
    if (this.firstCell && this.secondCell) {
      this.oldFirstCell = { ...this.firstCell };
      this.oldSecondCell = { ...this.secondCell };
    }
  }

  public showHint(): void {
    this.endEraserMode();
    // globalStore.burger.close();
    if (this.firstCell) {
      this.store.setFirstCell(null);
      this.firstCell = null;
    }
    this.canClick = false;
    const index = Math.floor(this.hints.length * Math.random());
    this.store.setHintPair(this.hints[index]);

    const hintDelay = setTimeout(() => {
      this.canClick = true;
      this.store.setHintPair(null);
      clearTimeout(hintDelay);
    }, Constants.HINT_DELAY);
    this.soundService.assist();
  }

  private canMove(): void {
    if (this.store.score() >= 100) {
      this.gameOver(GameOverCode.WIN);
      return;
    }
    if (!this.hasCells() && this.store.reverts() === 0) {
      this.gameOver(GameOverCode.LIMIT);
    }
    if (
      this.store.hints() === 0 &&
      this.store.adds() === 0 &&
      this.store.erasers() === 0 &&
      this.store.reverts() === 0
    ) {
      this.gameOver(GameOverCode.LIMIT);
    }
  }

  private hasCells(): boolean {
    return this.cells.flat().some((s) => s);
  }

  private gameOver(code: GameOverCode): void {
    // const time = globalStore.gamePage.timeScore.getTime();
    this.stopTimer();
    this.store.setGameOverCode(code);
    this.store.setShowResults(true);
    // globalStore.gamePage.modal.show(code, this.score, time);
    // storageStore.saveHighScores(this.mode, this.score, !code, time, this.moves);
    this.play = false;
    // globalStore.sound.stopBackground();
    if (code === GameOverCode.WIN) {
      this.soundService.win();
    } else {
      this.soundService.loss();
    }
  }
}
