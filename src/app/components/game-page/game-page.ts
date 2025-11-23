import { Component } from '@angular/core';
import { ModeInfo } from './mode-info/mode-info';
import { TimeScore } from './time-score/time-score';
import { ControlTools } from './control-tools/control-tools';
import { AssistTools } from './assist-tools/assist-tools';

@Component({
  selector: 'app-game-page',
  imports: [ModeInfo, TimeScore, ControlTools, AssistTools],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css',
})
export class GamePage {}
