import { ElementRef, Injectable } from '@angular/core';
import { Point } from '../interfaces/point.interface';

@Injectable()
export class WorkshopCoordsService {
  cameraX = 0;
  cameraY = 0;
  #zoom = 1;

  minZoom = 0.1;
  maxZoom = 10;

  getWorldCoords(
    e: MouseEvent,
    canvasRef: ElementRef<HTMLCanvasElement>
  ): Point {
    const rect = canvasRef.nativeElement.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const x = (screenX - this.cameraX) / this.#zoom;
    const y = (screenY - this.cameraY) / this.#zoom;

    return { x, y };
  }

  get zoom() {
    return this.#zoom;
  }

  set zoom(newZoom: number) {
    if (newZoom > this.maxZoom || newZoom < this.minZoom) return;

    this.#zoom = newZoom;
  }
}
