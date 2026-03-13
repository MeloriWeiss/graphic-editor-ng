import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { NavigationManagerComponent } from '@ge/shared';
import { ModalHostComponent } from '@ge/common-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationManagerComponent, ModalHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
