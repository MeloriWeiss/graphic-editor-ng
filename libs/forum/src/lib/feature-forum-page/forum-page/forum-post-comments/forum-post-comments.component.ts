import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgComponent } from '@ge/common-ui';

@Component({
  selector: 'ge-forum-post-comments',
  imports: [SvgComponent],
  templateUrl: './forum-post-comments.component.html',
  styleUrl: './forum-post-comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumPostCommentsComponent {}
