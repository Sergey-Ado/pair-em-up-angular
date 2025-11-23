import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';

@Component({
  selector: 'app-time-score',
  imports: [],
  templateUrl: './time-score.html',
  styleUrl: './time-score.css',
})
export class TimeScore {
  store = inject(Store);
}
