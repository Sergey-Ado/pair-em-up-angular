export enum Constants {
  GITHUB = 'https://github.com/sergey-ado',
  REMOVE_DELAY = 300,
  HINT_DELAY = 1000,
}

export enum Pages {
  START = 'start',
  GAME = 'game',
  HIGH_SCORE = 'high-score',
}

export enum Modes {
  CLASSIC = 'classic',
  RANDOM = 'random',
  CHAOTIC = 'chaotic',
}

export enum EffectPaths {
  START = '/audio/effects/effect-start.mp3',
  SELECT = '/audio/effects/effect-select.mp3',
  UNSELECT = '/audio/effects/effect-unselect.mp3',
  REMOVE = '/audio/effects/effect-remove.mp3',
  ERROR = '/audio/effects/effect-error.mp3',
  ASSIST = '/audio/effects/effect-assist.mp3',
  WIN = '/audio/effects/effect-win.mp3',
  LOSS = '/audio/effects/effect-loss.mp3',
}

export enum GameOverCode {
  WIN,
  NO_MOVE,
  LIMIT,
}

export enum GameOverTitle {
  WIN = 'win',
  LOSS = 'loss',
}

export enum GameOverMessage {
  WIN = "Congratulate. You've won.",
  NO_MOVE = 'You have exceeded the limit of 50 lines.',
  LIMIT = 'You have no available moves',
}
