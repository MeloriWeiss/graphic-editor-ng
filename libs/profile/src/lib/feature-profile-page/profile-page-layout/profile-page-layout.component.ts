import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SvgComponent } from '@ge/common-ui';

@Component({
  selector: 'ge-profile-page-layout',
  imports: [RouterOutlet, SvgComponent, RouterLink, RouterLinkActive],
  templateUrl: './profile-page-layout.component.html',
  styleUrl: './profile-page-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageLayoutComponent {}
