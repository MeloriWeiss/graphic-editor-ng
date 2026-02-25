import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorComponent } from '@ge/common-ui';

@Component({
  selector: 'ge-profile-page-favourite',
  imports: [ErrorComponent],
  templateUrl: './profile-page-favourite.component.html',
  styleUrl: './profile-page-favourite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageFavouriteComponent {}
