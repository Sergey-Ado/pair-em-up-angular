import { inject, Injectable } from '@angular/core';
import { Constants, GameOverCode, Modes } from '../types/constants';
import { Store } from '../store/store';
import { ICell, IHintPair, TSelectCell } from '../types/game-types';
import { SoundService } from './sound-service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly store = inject(Store);
  private readonly soundService = inject(SoundService);

  private timerIncrement = 0;
  private cells: number[][] = [[0]];
  private hints: IHintPair[] = [];
  private canClick = true;
  private oldFirstCell: TSelectCell = null;
  private oldSecondCell: TSelectCell = null;

  private startTimer(time = 0): void {
    this.store.setTime(time);
    if (this.timerIncrement) {
      clearInterval(this.timerIncrement);
    }
    this.timerIncrement = setInterval(() => {
      this.store.setTime(this.store.gameCounters.time() + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerIncrement) {
      clearInterval(this.timerIncrement);
    }
  }

  public newGame(mode: Modes | undefined = undefined): void {
    if (mode) {
      this.store.setMode(mode);
    }
    this.startTimer();

    this.createNewCells();

    this.createFirstCells();
    this.updateStoreCells();
    this.store.resetGame();

    this.calculateHints();
    this.store.setPlay(true);
    // globalStore.sound.startBackground();
    this.soundService.start();
  }

  private updateStoreCells(): void {
    const countRow = Math.ceil(this.store.gameState.nextIndex() / 9);
    const cells = this.cells.slice(0, countRow);
    this.store.setCells(cells);
  }

  private createNewCells(): void {
    this.cells = [];
    for (let i = 0; i < 50; i++) {
      const line: number[] = [];
      for (let j = 0; j < 9; j++) {
        line.push(0);
      }
      this.cells.push(line);
    }
    this.store.setNextIndex(0);
  }

  private createFirstCells(): void {
    let numbers = [];
    if (this.store.gameState.mode() === Modes.CHAOTIC) {
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
      if (this.store.gameState.mode() === Modes.RANDOM) {
        numbers.sort(() => Math.random() - 0.5);
      }
    }
    numbers.forEach((s) => this.setNextValue(+s));
  }

  private setNextValue(value: number): void {
    const nextIndex = this.store.gameState.nextIndex();
    const i = Math.floor(nextIndex / 9);
    const j = nextIndex % 9;
    this.cells[i][j] = value;
    this.store.setNextIndex(nextIndex + 1);
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

    if (this.store.gameState.firstCell() === null) {
      if (this.store.gameState.eraserMode()) {
        this.endEraserMode();
        this.canClick = false;
        this.store.setFirstCell(cell);
        this.store.setFirstCell(cell);
        setTimeout(() => {
          this.canClick = true;
          this.eraser();
        }, Constants.REMOVE_DELAY);
        return;
      } else {
        this.store.setFirstCell(cell);
        this.store.setFirstCell(cell);
        this.soundService.select();
        return;
      }
    }

    if (this.store.gameState.firstCell() === cell) {
      this.store.setFirstCell(null);
      this.store.setFirstCell(null);
      this.soundService.unselect();
      return;
    }

    this.store.setSecondCell(cell);

    let pairValue = 0;
    const firstCell = this.store.gameState.firstCell();
    const secondCell = this.store.gameState.secondCell();
    if (firstCell && secondCell) {
      pairValue = this.pairCellValue(firstCell, secondCell);
    }
    if (pairValue && (this.isHorizontal() || this.isVertical())) {
      this.store.setScore(this.store.gameCounters.score() + pairValue);
      this.store.setReverts(1);
      this.store.setMoves(this.store.gameCounters.moves() + 1);
      this.removePair();
    } else {
      this.cancelPair();
    }
  }

  private isVertical(): boolean {
    if (
      !(this.store.gameState.firstCell() && this.store.gameState.secondCell())
    )
      return false;
    const firstCell = this.store.gameState.firstCell();
    const secondCell = this.store.gameState.secondCell();
    if (firstCell && secondCell) {
      const col = firstCell.col;
      if (col !== secondCell.col) return false;
      const dRow = secondCell.row > firstCell.row ? 1 : -1;
      let row = firstCell.row + dRow;
      while (this.cells[row][col] === 0) {
        row += dRow;
      }
      return row === secondCell.row;
    }
    return false;
  }

  private isHorizontal(): boolean {
    const firstCell = this.store.gameState.firstCell();
    const secondCell = this.store.gameState.secondCell();
    if (!(firstCell && secondCell)) return false;

    const dCol =
      (firstCell.row === secondCell.row && firstCell.col < secondCell.col) ||
      firstCell.row < secondCell.row
        ? 1
        : -1;
    let row = firstCell.row;
    let col = firstCell.col + dCol;
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
    return row === secondCell.row && col === secondCell.col;
  }

  private removePair(): void {
    const firstCell = this.store.gameState.firstCell();
    const secondCell = this.store.gameState.secondCell();

    if (!(firstCell && secondCell)) return;

    this.canClick = false;
    this.soundService.remove();
    const removeDelay = setTimeout(() => {
      if (!(firstCell && secondCell)) return;
      this.saveOldCells();
      this.cells[firstCell.row][firstCell.col] = 0;
      this.cells[secondCell.row][secondCell.col] = 0;
      this.store.setFirstCell(null);
      this.store.setSecondCell(null);
      this.updateStoreCells();
      clearTimeout(removeDelay);
      this.canClick = true;
      this.calculateHints();
      this.canMove();
    }, Constants.REMOVE_DELAY);
  }

  private cancelPair(): void {
    const firstCell = this.store.gameState.firstCell();
    const secondCell = this.store.gameState.secondCell();

    if (!(firstCell && secondCell)) return;
    this.canClick = false;
    this.store.setErrorCell(secondCell);
    const errorDelay = setTimeout(() => {
      if (!(firstCell && secondCell)) return;
      this.store.setFirstCell(null);
      this.store.setErrorCell(null);
      clearTimeout(errorDelay);
      this.canClick = true;
    }, Constants.REMOVE_DELAY);
    this.soundService.error();
  }

  public addNumbers(): void {
    // globalStore.burger.close();
    this.endEraserMode();
    let numbers = this.cells.flat().filter((s) => s);
    if (this.store.gameState.mode() === Modes.RANDOM) {
      numbers.sort(() => Math.random() - 0.5);
    }
    if (this.store.gameState.mode() === Modes.CHAOTIC) {
      numbers = numbers.map(() => Math.floor(9 * Math.random()) + 1);
    }

    this.soundService.assist();
    for (let i = 0; i < numbers.length; i++) {
      if (this.store.gameState.nextIndex() > 449 && i < numbers.length - 1) {
        this.gameOver(GameOverCode.NO_MOVE);
        break;
      }
      this.setNextValue(numbers[i]);
    }

    this.updateStoreCells();

    this.store.setReverts(0);
    this.store.setAdds(this.store.gameCounters.adds() - 1);
    if (this.store.gameState.firstCell()) {
      this.store.setFirstCell(null);
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

    this.store.setShuffles(this.store.gameCounters.shuffles() - 1);
    this.store.setReverts(0);
    this.calculateHints();

    if (this.store.gameState.firstCell()) {
      this.store.setFirstCell(null);
    }

    this.updateStoreCells();
    this.soundService.assist();
    this.canMove();
  }

  public eraser(): void {
    // globalStore.burger.close();
    const firstCell = this.store.gameState.firstCell();

    if (firstCell) {
      this.cells[firstCell.row][firstCell.col] = 0;
      this.store.setFirstCell(null);
      this.store.setErasers(this.store.gameCounters.erasers() - 1);
      this.store.setReverts(0);
      this.calculateHints();
      this.updateStoreCells();
      this.soundService.assist();
      this.canMove();
    } else {
      if (this.store.gameState.eraserMode()) {
        this.endEraserMode();
      } else {
        this.store.setEraserMode(true);
        this.store.setEraserMode(true);
      }
    }
  }

  private endEraserMode(): void {
    this.store.setEraserMode(false);
    this.store.setEraserMode(false);
  }

  public revert(): void {
    this.endEraserMode();
    // globalStore.burger.close();
    if (this.store.gameState.firstCell()) {
      this.store.setFirstCell(null);
    }
    if (this.oldFirstCell && this.oldSecondCell) {
      this.cells[this.oldFirstCell.row][this.oldFirstCell.col] =
        this.oldFirstCell.value;
      this.cells[this.oldSecondCell.row][this.oldSecondCell.col] =
        this.oldSecondCell.value;
      this.updateStoreCells();

      const delta = this.pairCellValue(this.oldFirstCell, this.oldSecondCell);
      console.log(delta, this.oldFirstCell, this.oldSecondCell);
      this.store.setScore(this.store.gameCounters.score() - delta);
      this.store.setReverts(0);
      this.store.setMoves(this.store.gameCounters.moves() - 1);
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
    const firstCell = this.store.gameState.firstCell();
    const secondCell = this.store.gameState.secondCell();

    if (firstCell && secondCell) {
      this.oldFirstCell = firstCell;
      this.oldSecondCell = secondCell;
    }
  }

  public showHint(): void {
    this.endEraserMode();
    // globalStore.burger.close();
    if (this.store.gameState.firstCell()) {
      this.store.setFirstCell(null);
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
    if (this.store.gameCounters.score() >= 100) {
      this.gameOver(GameOverCode.WIN);
      return;
    }
    if (!this.hasCells() && this.store.gameCounters.reverts() === 0) {
      this.gameOver(GameOverCode.LIMIT);
    }
    if (
      this.store.gameCounters.hints() === 0 &&
      this.store.gameCounters.adds() === 0 &&
      this.store.gameCounters.erasers() === 0 &&
      this.store.gameCounters.reverts() === 0
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
    this.store.setPlay(false);
    // globalStore.sound.stopBackground();
    if (code === GameOverCode.WIN) {
      this.soundService.win();
    } else {
      this.soundService.loss();
    }
  }
}
