import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';
import { TimeFormatPipe } from '../../../pipes/time-format-pipe';
import { Pages } from '../../../types/constants';

@Component({
  selector: 'app-results-modal',
  imports: [TimeFormatPipe],
  templateUrl: './results-modal.html',
  styleUrl: './results-modal.css',
})
export class ResultsModal {
  protected store = inject(Store);

  protected showStart(): void {
    this.store.setShowResults(false);
    this.store.setPageIndex(Pages.START);
  }
}
