import { BaseShape } from './shape.interface';

export class BaseShapeShape implements BaseShape {
  strokeColor = '#000';
  opacity = 1;
  strokeWidth = 1;
  selected = false;

  constructor(params: BaseShape) {
    this.strokeColor = params.strokeColor;
    this.opacity = params.opacity;
    this.strokeWidth = params.strokeWidth;
  }
}
