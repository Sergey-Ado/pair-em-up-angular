import { Component, inject } from '@angular/core';
import { Store } from '../../../store/store';
import { TimeFormatPipe } from '../../../pipes/time-format-pipe';

@Component({
  selector: 'app-time-score',
  imports: [TimeFormatPipe],
  templateUrl: './time-score.html',
})
export class TimeScore {
  protected store = inject(Store);
}
