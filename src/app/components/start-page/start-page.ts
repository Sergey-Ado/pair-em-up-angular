import { Component, inject, OnInit } from '@angular/core';
import { Constants, Pages } from '../../types/constants';
import { ModeSelection } from './mode-selection/mode-selection';
import { Store } from '../../store/store';
import { GameService } from '../../services/game-service';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-start-page',
  imports: [ModeSelection],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css',
})
export class StartPage implements OnInit {
  protected github = Constants.GITHUB;
  protected store = inject(Store);
  protected gameService = inject(GameService);
  protected storageService = inject(StorageService);

  protected load(): void {
    this.store.setPageIndex(Pages.GAME);
    this.gameService.loadGame();
  }

  public ngOnInit(): void {
    const canLoadGame = this.storageService.hasGame();
    this.store.setCanLoadGame(canLoadGame);
  }
}
