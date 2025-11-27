import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';
import { Modes, Pages } from '../../../types/constants';
import { GameService } from '../../../services/game-service';

@Component({
  selector: 'app-mode-selection',
  imports: [],
  templateUrl: './mode-selection.html',
  styleUrl: './mode-selection.css',
})
export class ModeSelection {
  private store = inject(Store);
  private gameService = inject(GameService);

  protected startClassic(): void {
    this.store.setPageIndex(Pages.GAME);
    this.gameService.newGame(Modes.CLASSIC);
  }

  protected startRandom(): void {
    this.store.setPageIndex(Pages.GAME);
    this.gameService.newGame(Modes.RANDOM);
  }

  protected startChaotic(): void {
    this.store.setPageIndex(Pages.GAME);
    this.gameService.newGame(Modes.CHAOTIC);
  }
}
