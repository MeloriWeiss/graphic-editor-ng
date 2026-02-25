import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@ge/data-access/auth';
import {
  FormInputComponent,
  LabeledFormFieldWrapperComponent,
} from '@ge/common-ui';
import { LabeledCheckboxComponent } from '@ge/common-ui';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'ge-login-page',
  imports: [
    FormInputComponent,
    LabeledFormFieldWrapperComponent,
    LabeledCheckboxComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl<string | null>('', {
      validators: Validators.required,
    }),
    password: new FormControl<string | null>('', {
      validators: Validators.required,
    }),
  });

  onSubmit() {
    /* empty */
  }
}
