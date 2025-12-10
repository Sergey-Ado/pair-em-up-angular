import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game-service';
import { Store } from '../../../../store/store';

@Component({
  selector: 'app-mode-info',
  imports: [],
  templateUrl: './mode-info.html',
})
export class ModeInfo {
  protected gameService = inject(GameService);
  protected store = inject(Store);
}
