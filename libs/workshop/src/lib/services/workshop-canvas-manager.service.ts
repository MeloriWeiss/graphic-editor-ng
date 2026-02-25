import { inject, Injectable } from '@angular/core';
import { WorkshopCanvasService } from './workshop-canvas.service';
import { WorkshopShapesService } from './workshop-shapes.service';
import { WorkshopCoordsService } from './workshop-coords.service';

@Injectable()
export class WorkshopCanvasManagerService {
  #workshopCanvasService = inject(WorkshopCanvasService);
  #workshopShapesService = inject(WorkshopShapesService);
  #workshopCoordsService = inject(WorkshopCoordsService);

  clearCanvas() {
    const canvas = this.#workshopCanvasService.canvasRef.nativeElement;

    this.#workshopCanvasService.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.#workshopCanvasService.ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  redraw() {
    const ctx = this.#workshopCanvasService.ctx;

    this.clearCanvas();

    const zoom = this.#workshopCoordsService.zoom;

    ctx.translate(this.#workshopCoordsService.cameraX, this.#workshopCoordsService.cameraY);
    ctx.scale(zoom, zoom);

    this.render();
  }

  render() {
    const ctx = this.#workshopCanvasService.ctx;
    const zoom = this.#workshopCoordsService.zoom;

    // ТЕСТОВОЕ ПОЛЕ ---------------------------------
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(-1000, -1000, 2000, 2000); // пример фона
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1 / zoom;
    for (let x = -1000; x <= 1000; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, -1000);
      ctx.lineTo(x, 1000);
      ctx.stroke();
    }
    for (let y = -1000; y <= 1000; y += 100) {
      ctx.beginPath();
      ctx.moveTo(-1000, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }
    // КОНЕЦ ТЕСТОВОГО ПОЛЯ ---------------------------------

    for (const shape of this.#workshopShapesService.shapes) {
      shape.draw(ctx);
    }
  }
}
