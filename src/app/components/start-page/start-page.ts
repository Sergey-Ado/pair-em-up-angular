import { Component, inject } from '@angular/core';
import { Constants, Pages } from '../../types/constants';
import { ModeSelection } from './mode-selection/mode-selection';
import { Store } from '../../store/store';
import { GameService } from '../../services/game-service';

@Component({
  selector: 'app-start-page',
  imports: [ModeSelection],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css',
})
export class StartPage {
  protected github = Constants.GITHUB;
  protected store = inject(Store);
  protected gameService = inject(GameService);

  protected load(): void {
    this.store.setPageIndex(Pages.GAME);
    this.gameService.loadGame();
  }
}
