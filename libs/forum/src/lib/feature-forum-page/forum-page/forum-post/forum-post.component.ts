import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgComponent } from '@ge/common-ui';

@Component({
  selector: 'ge-forum-post',
  imports: [SvgComponent],
  templateUrl: './forum-post.component.html',
  styleUrl: './forum-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumPostComponent {}
