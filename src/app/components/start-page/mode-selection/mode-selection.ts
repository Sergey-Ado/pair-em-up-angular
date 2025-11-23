import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';
import { Pages } from '../../../constants';

@Component({
  selector: 'app-mode-selection',
  imports: [],
  templateUrl: './mode-selection.html',
  styleUrl: './mode-selection.css',
})
export class ModeSelection {
  private store = inject(Store);

  protected startClassic(): void {
    this.store.setPageIndex(Pages.GAME);
  }
}
