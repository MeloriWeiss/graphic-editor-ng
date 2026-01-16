import { Injectable } from '@angular/core';
import { Shape } from '../shapes';

// interface Layer {
//   shapes: Shape[];
//   layers: Layer[];
// }

@Injectable()
export class WorkshopShapesService {
  // СТРУКТУРА ДЛЯ СОЗДАНИЯ СЛОЁВ:
  // shapesWithLayers: Layer = {
  //   shapes: [],
  //   layers: [
  //     {
  //       shapes: [],
  //       layers: [],
  //     },
  //   ],
  // };

  shapes: Shape[] = [];
}
