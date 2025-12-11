import { Component, HostListener, inject } from '@angular/core';
import { StartPage } from './components/start-page/start-page';
import { Header } from './components/header/header';
import { Store } from '../store/store';
import { GamePage } from './components/game-page/game-page';
import { Modal } from './components/modals/modal/modal';
import { ResultsModal } from './components/modals/results-modal/results-modal';
import { StorageService } from './services/storage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [StartPage, Header, GamePage, Modal, ResultsModal],
  styleUrl: './app.css',
})
export class App {
  protected readonly store = inject(Store);
  private storageService = inject(StorageService);

  @HostListener('window:beforeunload')
  public onBeforeUnload(): void {
    this.storageService.saveGame();
  }
}
