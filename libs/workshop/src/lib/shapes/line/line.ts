import { Line, LineCreateData } from './line.interface';
import { BaseShapeShape } from '../shape';
import { ShapesTypes } from '../../consts';
import { Point } from '../../interfaces';
import { SelectionRect } from '../../tools';

export class LineShape extends BaseShapeShape implements Line {
  type = ShapesTypes.RECTANGLE;

  points: Point[] = [];

  #selectThreshold = 4;

  constructor(line: LineCreateData) {
    super({
      strokeColor: line.strokeColor,
      strokeWidth: line.strokeWidth,
      opacity: line.opacity,
    });

    this.points = line.points;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.strokeWidth;
    ctx.globalAlpha = this.opacity;

    if (this.selected) {
      ctx.strokeStyle = '#0199dc';
    } else {
      ctx.strokeStyle = this.strokeColor;
    }

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
  }

  clickOn() {
    return false;
  }

  selectByClick(point: Point) {
    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];

      const distance = getDistancePointToSegment(
        point.x,
        point.y,
        p1.x,
        p1.y,
        p2.x,
        p2.y
      );

      if (distance <= this.#selectThreshold) {
        this.selected = true;
        break;
      } else {
        this.selected = false;
      }
    }

    function getDistancePointToSegment(
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) {
      const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

      if (lineLengthSquared === 0) {
        return Math.hypot(px - x1, py - y1);
      }

      let t =
        ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;
      t = Math.max(0, Math.min(1, t));

      const closestX = x1 + t * (x2 - x1);
      const closestY = y1 + t * (y2 - y1);

      return Math.hypot(px - closestX, py - closestY);
    }

    return this.selected;
  }

  selectByDraw(selectionRect: SelectionRect) {
    for (let i = 0; i < this.points.length; i++) {
      const p1 = this.points[i];

      if (lineIntersectsRect(p1.x, p1.y, selectionRect)) {
        this.selected = true;
        break;
      } else {
        this.selected = false;
      }
    }

    function lineIntersectsRect(x1: number, y1: number, rect: SelectionRect) {
      return (
        x1 >= rect.x &&
        x1 <= rect.x + rect.width &&
        y1 >= rect.y &&
        y1 <= rect.y + rect.height
      );
    }

    return this.selected;
  }

  changePosition(point: Point) {

  }
}
