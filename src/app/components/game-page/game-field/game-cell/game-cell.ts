import { Component, computed, inject, input } from '@angular/core';
import { Store } from '../../../../../store/store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game-cell',
  imports: [NgClass],
  templateUrl: './game-cell.html',
  styleUrl: './game-cell.css',
})
export class GameCell {
  public value = input<string>();
  private store = inject(Store);

  protected class = computed(() => {
    const classes = ['game-cell'];
    if (this.store.canHover()) classes.push('can-hover');
    return classes.join(' ');
  });
}
