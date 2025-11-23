import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-burger',
  imports: [NgClass],
  templateUrl: './burger.html',
  styleUrl: './burger.css',
})
export class Burger {
  protected isOpen = signal(false);
  protected isEnabled = signal(false);

  constructor() {
    window.addEventListener('resize', () => {
      if (this.isOpen() && document.documentElement.clientWidth > 705) {
        this.close();
      }
    });
  }

  private open() {
    this.isOpen.set(true);
  }

  private close() {
    this.isOpen.set(false);
  }

  private enabled() {
    this.isEnabled.set(true);
  }

  private disabled() {
    this.isEnabled.set(false);
  }

  protected toggleBurger() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}
