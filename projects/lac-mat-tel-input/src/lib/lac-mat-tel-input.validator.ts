import {FormControl} from '@angular/forms';
import {parsePhoneNumber, PhoneNumber} from 'libphonenumber-js';

export const phoneNumberValidator = (control: FormControl) => {
  const error = {invalidPhone: true};
  let numberInstance: PhoneNumber;
  
  if (control.value) {
    try {
      numberInstance = parsePhoneNumber(control.value);
    } catch (e) {
      return error;
    }

    if (numberInstance && !numberInstance.isValid()) {
      return error;
    }
  }
};
