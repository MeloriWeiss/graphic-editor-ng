import { inject, Injectable } from '@angular/core';
import { fromEvent, merge, switchMap, takeUntil } from 'rxjs';
import { WorkshopDrawService } from './workshop-draw.service';
import { WorkshopSettingsService } from './workshop-settings.service';
import { WorkshopCoordsService } from './workshop-coords.service';
import { WorkshopCanvasManagerService } from './workshop-canvas-manager.service';
import { WorkshopCanvasService } from './workshop-canvas.service';

@Injectable()
export class WorkshopPanningService {
  #workshopDrawService = inject(WorkshopDrawService);
  #workshopSettingsService = inject(WorkshopSettingsService);
  #workshopCoordsService = inject(WorkshopCoordsService);
  #workshopCanvasManagerService = inject(WorkshopCanvasManagerService);
  #workshopCanvasService = inject(WorkshopCanvasService);

  panningMouseButton = this.#workshopSettingsService.panningMouseButton;

  #width!: number;
  #height!: number;

  // Для панорамирования
  isPanning = false;
  panStartX = 0;
  panStartY = 0;
  cameraStartX = 0;
  cameraStartY = 0;

  listenPanningEvents() {
    const canvas = this.#workshopCanvasService.canvasRef.nativeElement;

    const panningStart$ = fromEvent<MouseEvent, void>(
      canvas,
      'mousedown',
      (e) => this.onMouseDown(e)
    );
    const panningMove$ = fromEvent<MouseEvent, void>(canvas, 'mousemove', (e) =>
      this.onMouseMove(e)
    );
    const panningEndOnMouseUp$ = fromEvent(canvas, 'mouseup', () =>
      this.onMouseUp()
    );
    const panningEndOnMouseOut$ = fromEvent(canvas, 'mouseout', () =>
      this.onMouseUp()
    );

    const panningEnd$ = merge(panningEndOnMouseUp$, panningEndOnMouseOut$);

    return panningStart$.pipe(
      switchMap(() => panningMove$.pipe(takeUntil(panningEnd$)))
    );
  }

  listenZoomEvent() {
    const canvas = this.#workshopCanvasService.canvasRef.nativeElement;

    return fromEvent<WheelEvent, void>(canvas, 'wheel', (e) => this.onWheel(e));
  }

  listenResizeEvent() {
    return fromEvent(window, 'resize', () => this.resizeCanvas());
  }

  listenCanvasManagementEvents() {
    const panningEvents$ = this.listenPanningEvents();
    const zoomEvent$ = this.listenZoomEvent();
    const resizeEvent$ = this.listenResizeEvent();

    return merge(panningEvents$, zoomEvent$, resizeEvent$);
  }

  resizeCanvas() {
    const canvas = this.#workshopCanvasService.canvasRef.nativeElement;

    this.#width = window.innerWidth;
    this.#height = window.innerHeight;

    canvas.width = this.#width - 350;
    canvas.height = this.#height - 37;

    this.redraw();
  }

  centerCanvas() {
    this.#workshopCoordsService.cameraX = window.innerWidth / 2;
    this.#workshopCoordsService.cameraY = window.innerHeight / 2;
  }

  onWheel(e: WheelEvent) {
    if (!e.ctrlKey) return;

    e.preventDefault();

    let zoom = this.#workshopCoordsService.zoom;

    const zoomFactor = 1.1;
    const oldZoom = zoom;
    if (e.deltaY < 0) {
      this.#workshopCoordsService.zoom *= zoomFactor;
    } else {
      this.#workshopCoordsService.zoom /= zoomFactor;
    }

    zoom = this.#workshopCoordsService.zoom;
    // Зум в точке курсора
    const rect =
      this.#workshopDrawService.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - this.#workshopCoordsService.cameraX) / oldZoom;
    const worldY = (mouseY - this.#workshopCoordsService.cameraY) / oldZoom;

    this.#workshopCoordsService.cameraX -= (zoom - oldZoom) * worldX;
    this.#workshopCoordsService.cameraY -= (zoom - oldZoom) * worldY;

    this.redraw();
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== this.panningMouseButton()) return;

    this.isPanning = true;
    this.panStartX = e.clientX;
    this.panStartY = e.clientY;
    this.cameraStartX = this.#workshopCoordsService.cameraX;
    this.cameraStartY = this.#workshopCoordsService.cameraY;
  }

  onMouseUp() {
    this.isPanning = false;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isPanning) return;

    const deltaX = e.clientX - this.panStartX;
    const deltaY = e.clientY - this.panStartY;
    this.#workshopCoordsService.cameraX = this.cameraStartX + deltaX;
    this.#workshopCoordsService.cameraY = this.cameraStartY + deltaY;

    this.redraw();
  }

  redraw() {
    this.#workshopCanvasManagerService.redraw();
  }
}
