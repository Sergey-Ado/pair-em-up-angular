import { Component, inject, OnInit } from '@angular/core';
import { StorageHighScoreData } from '../../types/storage-types';
import { StorageService } from '../../services/storage-service';
import { winLossImages } from '../../types/constants';

@Component({
  selector: 'app-high-scores-page',
  imports: [],
  templateUrl: './high-scores-page.html',
  styleUrl: './high-scores-page.css',
})
export class HighScoresPage implements OnInit {
  private storageService = inject(StorageService);
  protected highScores: StorageHighScoreData[] = [];
  protected columnNames = ['mode', 'score', 'win', 'time', 'moves'];
  protected winLoss = winLossImages;

  public ngOnInit(): void {
    this.highScores = this.storageService.loadHighScores();
  }
}
