import { Injectable, signal } from '@angular/core';
import { workshopDefaultSettings } from '../consts';

@Injectable()
export class WorkshopSettingsService {
  panningMouseButton = signal(workshopDefaultSettings.panningMouseButton);
  drawMouseButton = signal(workshopDefaultSettings.drawMouseButton);
}
