import { Component, inject } from '@angular/core';
import { Store } from '../../../store/store';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  protected store = inject(Store);
}
