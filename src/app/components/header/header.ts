import { Component } from '@angular/core';
import { Burger } from './burger/burger';

@Component({
  selector: 'app-header',
  imports: [Burger],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
