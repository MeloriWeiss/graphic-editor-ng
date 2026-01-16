import { ShapesTypes } from '../consts';
import { Line, Rectangle, Shape } from '../shapes';

export const isRectangle = (shape: Shape): shape is Rectangle => {
  return shape.type === ShapesTypes.RECTANGLE;
};

export const isLine = (shape: Shape): shape is Line => {
  return shape.type === ShapesTypes.LINE;
}
