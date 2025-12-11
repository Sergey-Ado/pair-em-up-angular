import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game-service';
import { StorageService } from '../../../services/storage-service';

@Component({
  selector: 'app-control-tools',
  imports: [],
  templateUrl: './control-tools.html',
  styleUrl: './control-tools.css',
})
export class ControlTools {
  private gameService = inject(GameService);
  private storageService = inject(StorageService);

  protected reset(): void {
    this.gameService.newGame();
    // globalStore.burger.close();
  }

  protected save(): void {
    this.storageService.saveGame();
  }
}
