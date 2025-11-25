export interface ICell {
  row: number;
  col: number;
  value: number;
}

export type TSelectCell = ICell | null;

export type IHintPair = [ICell, ICell];
