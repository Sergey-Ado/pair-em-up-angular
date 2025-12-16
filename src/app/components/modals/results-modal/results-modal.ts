import { Component, inject } from '@angular/core';
import { Store } from '../../../store/store';
import { TimeFormatPipe } from '../../../pipes/time-format-pipe';
import { Pages } from '../../../types/constants';
import { GameService } from '../../../services/game-service';

@Component({
  selector: 'app-results-modal',
  imports: [TimeFormatPipe],
  templateUrl: './results-modal.html',
  styleUrl: './results-modal.css',
})
export class ResultsModal {
  protected store = inject(Store);
  private gameService = inject(GameService);

  protected gameAgain(): void {
    this.store.setShowResults(false);
    this.gameService.newGame();
  }

  protected showStart(): void {
    this.store.setShowResults(false);
    this.store.setPageIndex(Pages.START);
  }

  protected showHighScore(): void {
    this.store.setShowResults(false);
    this.store.setPageIndex(Pages.HIGH_SCORE);
  }
}
