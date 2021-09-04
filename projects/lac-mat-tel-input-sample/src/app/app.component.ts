import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { phoneNumberValidator } from 'projects/lac-mat-tel-input/src/lib/lac-mat-tel-input.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'lac-mat-tel-input-sample';

  form1: FormGroup;

  phone: string = '+5511912347894';
  phoneDisabled: boolean;

  name: string = '';
  nameDisabled: boolean;
  useInternationalFormat: boolean;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form1 = this.fb.group({
      phone: ['+919813785563'],
      name: ['']
    });

    this.form1.controls.phone.setValidators([phoneNumberValidator]);
  }

  toggleDisable(name: string) {
    let control = this.form1.controls[name];
    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }
}
