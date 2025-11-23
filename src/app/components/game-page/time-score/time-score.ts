import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';
import { TimeFormatPipePipe } from '../../../pipes/time-format-pipe-pipe';

@Component({
  selector: 'app-time-score',
  imports: [TimeFormatPipePipe],
  templateUrl: './time-score.html',
})
export class TimeScore {
  protected store = inject(Store);
}
