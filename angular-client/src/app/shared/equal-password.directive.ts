import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

/** A hero's name can't match the hero's alter ego */
export const equalPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirm_password = control.get('confirm_password');

  return password && confirm_password && password.value !== confirm_password.value ? { 'equalPassword': false } : null;
};