import { Component } from '@angular/core';
import { ModeInfo } from './mode-info/mode-info';
import { TimeScore } from './time-score/time-score';

@Component({
  selector: 'app-game-page',
  imports: [ModeInfo, TimeScore],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePage {}
