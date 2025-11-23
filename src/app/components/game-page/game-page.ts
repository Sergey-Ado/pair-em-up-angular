import { Component } from '@angular/core';
import { ModeInfo } from './mode-info/mode-info';

@Component({
  selector: 'app-game-page',
  imports: [ModeInfo],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePage {}
