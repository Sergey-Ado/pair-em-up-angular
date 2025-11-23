import { Component } from '@angular/core';
import { StartPage } from './components/start-page/start-page';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [StartPage, Header],
})
export class App {
  protected title = 'pair-em-up-angular';
}
