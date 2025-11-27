import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game-service';

@Component({
  selector: 'app-control-tools',
  imports: [],
  templateUrl: './control-tools.html',
  styleUrl: './control-tools.css',
})
export class ControlTools {
  private gameService = inject(GameService);

  protected reset(): void {
    this.gameService.newGame();
    // globalStore.burger.close();
  }
}
