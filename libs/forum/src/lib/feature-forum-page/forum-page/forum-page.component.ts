import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeskListComponent } from '@ge/common-ui';
import { ForumSidebarComponent } from '../../ui';
import { ForumPostComponent } from './forum-post/forum-post.component';
import { ForumPostCommentsComponent } from './forum-post-comments/forum-post-comments.component';

@Component({
  selector: 'ge-forum-page',
  imports: [
    DeskListComponent,
    ForumSidebarComponent,
    ForumPostComponent,
    ForumPostCommentsComponent,
  ],
  templateUrl: './forum-page.component.html',
  styleUrl: './forum-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumPageComponent {}
