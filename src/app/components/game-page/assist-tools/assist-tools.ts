import { Component, inject } from '@angular/core';
import { Store } from '../../../../store/store';

@Component({
  selector: 'app-assist-tools',
  imports: [],
  templateUrl: './assist-tools.html',
  styleUrl: './assist-tools.css',
})
export class AssistTools {
  protected store = inject(Store);
}
