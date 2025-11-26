import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';
import { GameService } from '../../../services/game-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-assist-tools',
  imports: [NgClass],
  templateUrl: './assist-tools.html',
  styleUrl: './assist-tools.css',
})
export class AssistTools {
  protected store = inject(Store);
  protected gameService = inject(GameService);

  protected hint(): void {
    this.gameService.showHint();
  }

  protected revert(): void {
    this.gameService.revert();
  }

  protected add(): void {
    this.gameService.addNumbers();
  }

  protected shuffle(): void {
    this.gameService.shuffle();
  }

  protected eraser(): void {
    this.gameService.eraser();
  }
}
