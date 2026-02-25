import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormInputComponent,
  LabeledFormFieldWrapperComponent,
} from '@ge/common-ui';
import { LabeledCheckboxComponent } from '@ge/common-ui';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ge-signup-page',
  imports: [
    FormInputComponent,
    LabeledCheckboxComponent,
    LabeledFormFieldWrapperComponent,
    RouterLink,
  ],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {}
