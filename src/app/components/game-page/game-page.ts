import { Component } from '@angular/core';
import { ModeInfo } from './mode-info/mode-info';
import { TimeScore } from './time-score/time-score';
import { ControlTools } from './control-tools/control-tools';

@Component({
  selector: 'app-game-page',
  imports: [ModeInfo, TimeScore, ControlTools],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePage {}
