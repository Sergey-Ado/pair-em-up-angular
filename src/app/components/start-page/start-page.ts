import { Component } from '@angular/core';
import { Constants } from '../../constants';
import { ModeSelection } from './mode-selection/mode-selection';

@Component({
  selector: 'app-start-page',
  imports: [ModeSelection],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css',
})
export class StartPage {
  protected github = Constants.GITHUB;
}
