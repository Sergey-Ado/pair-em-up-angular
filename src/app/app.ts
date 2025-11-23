import { Component } from '@angular/core';
import { StartPage } from './components/start-page/start-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [StartPage],
})
export class App {
  protected title = 'pair-em-up-angular';
}
