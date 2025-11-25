import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-border-cell',
  imports: [],
  templateUrl: './border-cell.html',
  styleUrl: './border-cell.css',
})
export class BorderCell {
  public row = input<string>();

  protected content = computed(() => {
    const index = Number(this.row()) + 1;
    return index === 1 || index % 5 === 0 ? index : '';
  });
}
