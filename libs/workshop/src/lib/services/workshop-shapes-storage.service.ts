import { computed, Injectable, signal } from '@angular/core';
import { Shape } from '../shapes';
import { Layers } from '../interfaces';

@Injectable()
export class WorkshopShapesStorageService {
  shapes = signal<Shape[]>([]);
  layers = signal<Layers>({});

  layersCount = computed(() => Object.keys(this.layers()).length);
  firstLayerId = computed(() => Object.keys(this.layers())[0]);

  layersOrder = signal<string[]>([]);
  activeLayerId = signal<string | null>(null);
}
