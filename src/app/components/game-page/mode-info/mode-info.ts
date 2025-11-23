import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game-service';

@Component({
  selector: 'app-mode-info',
  imports: [],
  templateUrl: './mode-info.html',
})
export class ModeInfo {
  protected gameService = inject(GameService);
}
