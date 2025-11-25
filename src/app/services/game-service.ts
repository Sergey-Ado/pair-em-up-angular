import { inject, Injectable } from '@angular/core';
import { Modes } from '../constants';
import { Store } from '../../store/store';

interface IHintCell {
  i: number;
  j: number;
  value: number;
}

type IHintPair = [IHintCell, IHintCell];

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly store = inject(Store);

  public mode = Modes.CLASSIC;
  private timerIncrement = 0;
  private cells: number[][] = [[0]];
  private nextIndex = 0;
  private play = false;
  private moves = 0;
  private hints: IHintPair[] = [];

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

    const countRow = Math.ceil(this.nextIndex / 9);
    const cells = this.cells.slice(0, countRow);
    this.store.setCells(cells);
    console.log(cells);

    this.clearCounters();
    this.calculateHints();
    this.play = true;
    // globalStore.sound.start();
    // globalStore.sound.startBackground();
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
        return { i: Math.floor(index / 9), j: index % 9, value: item };
      })
      .filter((item) => item.value);
    for (let i = 0; i < horizontal.length - 1; i++) {
      const pairValue = this.pairValue(
        horizontal[i].value,
        horizontal[i + 1].value,
      );
      if (pairValue) this.hints.push([horizontal[i], horizontal[i + 1]]);
    }

    for (let j = 0; j < 9; j++) {
      const vertical = [];
      for (let i = 0; i < 50; i++) {
        if (this.cells[i][j]) {
          vertical.push({ i, j, value: this.cells[i][j] });
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
}
