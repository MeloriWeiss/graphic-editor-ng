import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  WorkshopCanvasService,
  WorkshopDrawService,
  WorkshopPanningService,
} from '../../../../services';

@Component({
  selector: 'wm-workshop-canvas',
  imports: [FormsModule],
  templateUrl: './workshop-canvas.component.html',
  styleUrl: './workshop-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopCanvasComponent implements AfterViewInit {
  #destroyRef = inject(DestroyRef);
  #workshopDrawService = inject(WorkshopDrawService);
  #workshopCanvasService = inject(WorkshopCanvasService);
  #workshopPanningService = inject(WorkshopPanningService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  ngAfterViewInit() {
    const canvasRef = this.canvasRef();

    this.#workshopCanvasService.canvasRef = canvasRef;

    const canvas = canvasRef.nativeElement;
    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) return;

    this.#workshopCanvasService.ctx = canvasContext;

    this.setupCanvas();
    this.listenCanvasManagementEvents();
    this.listenDrawEvents();
  }

  setupCanvas() {
    this.#workshopCanvasService.ctx.lineCap = 'round';

    this.#workshopPanningService.centerCanvas();
    this.#workshopPanningService.resizeCanvas();
  }

  listenDrawEvents() {
    this.#workshopDrawService
      .listenDrawEvents()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe();
  }

  listenCanvasManagementEvents() {
    this.#workshopPanningService
      .listenCanvasManagementEvents()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe();
  }
}
