import { Component, output } from '@angular/core';
import { Constants, Pages } from '../../constants';
import { ModeSelection } from './mode-selection/mode-selection';

@Component({
  selector: 'app-start-page',
  imports: [ModeSelection],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css',
})
export class StartPage {
  github = Constants.GITHUB;
  setPageIndex = output<Pages>();

  setIndex() {
    this.setPageIndex.emit(Pages.GAME);
  }
}
