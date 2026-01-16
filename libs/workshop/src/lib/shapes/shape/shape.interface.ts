import { ShapesTypes } from '../../consts';
import { SelectionRect } from '../../tools';
import { Point } from '../../interfaces';

export interface BaseShape {
  selected?: boolean;
  strokeColor: string;
  opacity: number;
  strokeWidth: number;
}

export interface ShapeActions {
  draw: (ctx: CanvasRenderingContext2D) => void;
  clickOn: (point: Point) => boolean;
  selectByClick: (point: Point) => boolean;
  selectByDraw: (selectionRect: SelectionRect) => boolean;
  changePosition: (point: Point) => void;
}

export interface Shape extends BaseShape, ShapeActions {
  type: ShapesTypes;
}
