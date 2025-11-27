import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormatPipe',
})
export class TimeFormatPipe implements PipeTransform {
  public transform(value: number): string {
    const seconds = value % 60;
    const minutes = Math.floor(value / 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
