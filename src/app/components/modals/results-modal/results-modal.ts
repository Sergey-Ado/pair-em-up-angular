import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';
import { TimeFormatPipe } from '../../../pipes/time-format-pipe';

@Component({
  selector: 'app-results-modal',
  imports: [TimeFormatPipe],
  templateUrl: './results-modal.html',
  styleUrl: './results-modal.css',
})
export class ResultsModal {
  protected store = inject(Store);
}
