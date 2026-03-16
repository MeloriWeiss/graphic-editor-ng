import { inject, Injectable } from '@angular/core';
import { LineShape, Rectangle, RectangleShape, Shape } from '../shapes';
import { debounceTime, interval, merge, of, Subject, switchMap } from 'rxjs';
import { Layers, LayersStorage, ShapesData } from '../interfaces';
import { isLine, isRectangle } from '../guards';
import { WorkshopShapesStorageService } from './workshop-shapes-storage.service';
import { ShapesTypes } from '../consts';
import { WorkshopQuadtreeService } from './workshop-quadtree.service';

@Injectable()
export class WorkshopShapesService {
  #shapesStorageService = inject(WorkshopShapesStorageService);
  #quadtreeService = inject(WorkshopQuadtreeService);

  shapes = this.#shapesStorageService.shapes;
  layers = this.#shapesStorageService.layers;

  layersCount = this.#shapesStorageService.layersCount;
  firstLayerId = this.#shapesStorageService.firstLayerId;

  layersOrder = this.#shapesStorageService.layersOrder;
  activeLayerId = this.#shapesStorageService.activeLayerId;

  defaultLayer: Layers | null = null;

  #shapesChanges$ = new Subject<void>();
  #layersChanges$ = new Subject<void>();

  #autoSavesInterval$ = interval(60000);
  #savesDebounceTime = 1;

  #shapesSaves$ = merge(this.#shapesChanges$, this.#autoSavesInterval$).pipe(
    debounceTime(this.#savesDebounceTime),
    switchMap(() => {
      return this.#sendShapes();
    })
  );

  #layersSaves$ = merge(this.#layersChanges$, this.#autoSavesInterval$).pipe(
    debounceTime(this.#savesDebounceTime),
    switchMap(() => {
      return this.#sendLayers();
    })
  );

  saves$ = merge(this.#shapesSaves$, this.#layersSaves$);

  getShapes() {
    // this.generateTestShapes(50000);
    // return of([]);

    const shapes = localStorage.getItem('shapes');

    if (!shapes) {
      this.#ensureDefaultLayer();
      return of([]);
    }

    try {
      const result = JSON.parse(shapes) as (ShapesData & {
        layerId?: string;
      })[];

      this.shapes.set(this.#serializeShapes(result) ?? []);

      return of(result);
    } catch {
      return of([]);
    }
  }

  saveShapes() {
    this.#shapesChanges$.next();
  }

  #saveLayers() {
    this.#layersChanges$.next();
  }

  addShape(shape: Shape) {
    shape.layerId =
      this.activeLayerId() ?? Object.values(this.defaultLayer ?? {})[0].id;

    this.shapes.update((shapes) => [...shapes, shape]);

    this.saveShapes();
  }

  deleteShapes() {
    this.shapes.update((shapes) => {
      return shapes.filter((shape) => !shape.selected);
    });

    this.saveShapes();
  }

  setActiveLayer(layerId: string) {
    if (!this.layers()[layerId]) return;

    this.activeLayerId.set(layerId);
    this.#saveLayers();
  }

  addLayer(name?: string) {
    const layersNum = this.layersCount() + 1;
    const layerId = `layer-${Date.now()}-${layersNum}`;

    const newLayer: Layers = {
      [layerId]: {
        id: layerId,
        name: name ?? `Слой ${layersNum}`,
        visible: true,
      },
    };

    this.layers.update((layers) => ({
      ...layers,
      ...newLayer,
    }));
    this.activeLayerId.set(layerId);
    this.layersOrder.update((order) => [...order, layerId]);

    this.#saveLayers();
  }

  removeLayer(layerId: string) {
    if (this.layersCount() <= 1 || !this.layers()[layerId]) return;

    this.layers.update((layers) => {
      const { [layerId]: _, ...lrs } = layers;
      return lrs;
    });
    this.shapes.update((shapes) => {
      return shapes.filter((shape) => shape.layerId !== layerId);
    });

    if (this.activeLayerId() === layerId) {
      this.activeLayerId.set(this.firstLayerId() ?? null);
    }
    this.layersOrder.update((order) => order.filter((id) => id !== layerId));

    this.#saveLayers();
  }

  toggleLayerVisibility(layerId: string) {
    const layer = this.layers()[layerId];

    if (!layer) return;

    layer.visible = !layer.visible;
    this.#saveLayers();
  }

  renameLayer(layerId: string, name: string) {
    const layer = this.layers()[layerId];

    if (!layer) return;

    layer.name = name;
    this.#saveLayers();
  }

  moveLayerUp(layerId: string) {
    const order = this.layersOrder();
    const currentIndex = order.indexOf(layerId);

    if (currentIndex === -1) return;

    order.splice(currentIndex, 1);
    order.splice(currentIndex - 1, 0, layerId);

    this.layersOrder.set(order);

    this.#saveLayers();
  }

  moveLayerDown(layerId: string) {
    const order = this.layersOrder();
    const currentIndex = order.indexOf(layerId);

    if (currentIndex === -1) return;

    order.splice(currentIndex, 1);
    order.splice(currentIndex + 1, 0, layerId);

    this.layersOrder.set(order);

    this.#saveLayers();
  }

  reorderLayer(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    const layersOrder = this.layersOrder();

    const fromIndex = layersOrder.findIndex((lr) => lr === sourceId);
    const toIndex = layersOrder.findIndex((lr) => lr === targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [layerId] = layersOrder.splice(fromIndex, 1);
    const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;

    layersOrder.splice(insertIndex, 0, layerId);

    this.layersOrder.set(layersOrder);
    this.#saveLayers();
  }

  moveShapeUp(shape: Shape) {
    const index = this.shapes().indexOf(shape);
    if (index === -1) return;

    const currentLayerId = shape.layerId;
    if (!currentLayerId) return;

    for (let i = index + 1; i < this.shapes.length; i++) {
      if (this.shapes()[i].layerId === currentLayerId) {
        const [item] = this.shapes().splice(index, 1);

        this.shapes.update((shapes) => shapes.splice(i, 0, item));

        this.saveShapes();
        return;
      }
    }
  }

  moveShapeDown(shape: Shape) {
    const index = this.shapes().indexOf(shape);
    if (index <= 0) return;

    const currentLayerId = shape.layerId;
    if (!currentLayerId) return;

    for (let i = index - 1; i >= 0; i--) {
      if (this.shapes()[i].layerId === currentLayerId) {
        const [item] = this.shapes().splice(index, 1);

        this.shapes.update((shapes) => shapes.splice(i, 0, item));

        this.saveShapes();
        return;
      }
    }
  }

  getShapesForLayer(layerId: string) {
    return this.shapes().filter((shape) => shape.layerId === layerId);
  }

  isShapeVisible(shape: Shape) {
    if (!shape.layerId) return true;

    const layer = this.layers()[shape.layerId];

    return !!layer?.visible;
  }

  #sendShapes() {
    try {
      localStorage.setItem('shapes', JSON.stringify(this.shapes()));
      this.#saveLayers();
    } catch {
      of();
    }

    return of();
  }

  #serializeShapes(shapes: (ShapesData & { layerId?: string })[]) {
    const result: Shape[] = [];

    shapes.forEach((shape) => {
      let instance: Shape | null = null;

      if (isRectangle(shape)) {
        instance = new RectangleShape(shape);
      } else if (isLine(shape)) {
        instance = new LineShape(shape);
      }

      if (!instance) return;

      instance.layerId =
        shape.layerId ??
        this.activeLayerId() ??
        Object.values(this.defaultLayer ?? {})[0].id;

      result.push(instance);
    });

    return result;
  }

  #ensureDefaultLayer() {
    const layersCount = this.layersCount();

    if (!layersCount) {
      const layerId = 'layer-1';
      const defaultLayer: Layers = {
        [layerId]: {
          id: layerId,
          name: 'Слой 1',
          visible: true,
        },
      };

      this.layers.set(defaultLayer);
      this.activeLayerId.set(layerId);
      this.layersOrder.set([layerId]);

      this.#saveLayers();
    }

    if (!this.activeLayerId() && layersCount) {
      this.activeLayerId.set(this.firstLayerId());
      this.#saveLayers();
    }

    const firstLayerId = this.firstLayerId();

    this.defaultLayer = {
      [firstLayerId]: {
        ...this.layers()[firstLayerId],
      },
    };

    return this.defaultLayer;
  }

  getLayers() {
    const layersStorage = localStorage.getItem('layersData');

    if (!layersStorage) {
      this.#ensureDefaultLayer();
      return of({});
    }

    try {
      const parsedLayers = JSON.parse(layersStorage) as LayersStorage;

      this.layers.set(parsedLayers.layers ?? {});
      this.activeLayerId.set(
        parsedLayers.activeLayerId ?? this.firstLayerId() ?? null
      );
      this.layersOrder.set(parsedLayers.layersOrder ?? {});

      if (!this.layersCount()) {
        this.#ensureDefaultLayer();
      }
      return of({});
    } catch {
      this.#ensureDefaultLayer();
      return of({});
    }
  }

  #sendLayers() {
    const payload: LayersStorage = {
      layers: this.layers(),
      activeLayerId: this.activeLayerId(),
      layersOrder: this.layersOrder(),
    };

    try {
      localStorage.setItem('layersData', JSON.stringify(payload));
    } catch {
      of();
    }

    return of();
  }

  generateTestShapes(count: number) {
    const shapes: Shape[] = [];
    for (let i = 0; i < count; i++) {
      shapes.push(createRandomRect(`rect-${i}`, 10000, 10000));
    }
    this.#shapesStorageService.shapes.set(shapes);
    this.#quadtreeService.rebuildQuadtree();

    function createRandomRect(
      id: string,
      worldWidth: number,
      worldHeight: number
    ): Rectangle {
      const width = 20 + Math.random() * 80;
      const height = 20 + Math.random() * 80;
      const x = Math.random() * (worldWidth - width);
      const y = Math.random() * (worldHeight - height);

      return new RectangleShape({
        x,
        y,
        width,
        height,
        type: ShapesTypes.RECTANGLE,
        strokeColor: '#000000',
        fillColor: '#BD404030',
        strokeWidth: 1,
        opacity: 1,
      });
    }
  }
}
