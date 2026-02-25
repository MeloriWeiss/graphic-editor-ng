import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DateDiffPipe, SvgComponent } from '@ge/common-ui';
import { Discussion } from '@ge/data-access/forum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ge-discussion-card',
  imports: [SvgComponent, RouterLink, DateDiffPipe],
  templateUrl: './discussion-card.component.html',
  styleUrl: './discussion-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscussionCardComponent {
  discussion = input.required<Discussion>();
}
