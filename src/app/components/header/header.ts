import { Component, inject } from '@angular/core';
import { Burger } from './burger/burger';
import { Store } from '../../store/store';
import { Pages } from '../../types/constants';

@Component({
  selector: 'app-header',
  imports: [Burger],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private store = inject(Store);

  protected showHighScore(): void {
    this.store.setPageIndex(Pages.HIGH_SCORE);
  }
}
