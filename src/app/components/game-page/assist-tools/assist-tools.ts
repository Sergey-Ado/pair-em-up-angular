import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';
import { GameService } from '../../../services/game-service';

@Component({
  selector: 'app-assist-tools',
  imports: [],
  templateUrl: './assist-tools.html',
  styleUrl: './assist-tools.css',
})
export class AssistTools {
  protected store = inject(Store);
  protected gameService = inject(GameService);

  protected add(): void {
    this.gameService.addNumbers();
  }

  protected shuffle(): void {
    this.gameService.shuffle();
  }
}
