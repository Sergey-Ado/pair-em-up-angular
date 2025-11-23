import { Component, inject } from '@angular/core';
import { StartPage } from './components/start-page/start-page';
import { Header } from './components/header/header';
import { Store } from '../store/store';
import { GamePage } from './components/game-page/game-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [StartPage, Header, GamePage],
  providers: [Store],
})
export class App {
  readonly store = inject(Store);
}
