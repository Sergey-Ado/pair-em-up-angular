import { inject, Injectable } from '@angular/core';
import { Store } from '../../store/store';
import { EffectPaths } from '../types/constants';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private store = inject(Store);
  protected src = '';
  private sound: HTMLAudioElement;

  public constructor() {
    this.sound = new Audio();
    this.sound.autoplay = true;
  }

  public setSound(): void {
    // this.store.setBackground(path);
  }

  public start(): void {
    this.sound.src = EffectPaths.START;
  }

  public select(): void {
    this.sound.src = EffectPaths.SELECT;
  }

  public unselect(): void {
    this.sound.src = EffectPaths.UNSELECT;
  }

  public remove(): void {
    this.sound.src = EffectPaths.REMOVE;
  }

  public error(): void {
    this.sound.src = EffectPaths.ERROR;
  }

  public assist(): void {
    this.sound.src = EffectPaths.ASSIST;
  }
}
