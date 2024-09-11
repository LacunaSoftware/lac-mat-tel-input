import { Component, HostBinding, Input, Optional, Self, ElementRef, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import type { OnInit, OnDestroy } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subject } from 'rxjs';
import { NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getExampleNumber, parsePhoneNumberFromString, AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { Examples } from './data/country-code';

@Component({
  selector: 'lac-mat-tel-input',
  templateUrl: './lac-mat-tel-input.component.html',
  styleUrls: ['./lac-mat-tel-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: LacMatTelInputComponent}]
})
export class LacMatTelInputComponent implements OnInit, OnDestroy, MatFormFieldControl<string> {
  @Output()
  blur: EventEmitter<any> = new EventEmitter<any>();

  PhoneNumberMaxDigits: number = 20;

  phone: string;
  @ViewChild('phoneInput', { static: true }) phoneInput: MatInput;

  maxInputLength: number = this.PhoneNumberMaxDigits;

  //Subject to notify when country needs to be update from input
  //Se paste condition in onInputChanged
  countryChange = new Subject<CountryCode>();
  
  private selectedCountry: CountryCode;

  //Mat Form Field implementation - BEGIN
  stateChanges = new Subject<void>();

  //the value of the FormFieldControl
  _value: string;
  set value(v: string | null) {//whenever value changes -> this.stateChanges.next(); so form-field runs change detection
    this._value = v ? `+${getCountryCallingCode(this.selectedCountry)} ${v}` : v;

    if (this.internationalFormat && this._value) {
      let phoneNumber = parsePhoneNumberFromString(this._value);

      if (phoneNumber && phoneNumber.isValid()) {
        this._value = phoneNumber.formatInternational();
      }
    }

    if (this.firstChange) {
      this.firstChange = false;
      if (this._value == this.ngControl?.value) {
        return;
      }
    }

    this.propagateChange(this._value);
    this.stateChanges.next();
  };

  //the id of an element to associate labels and hints with.
  static nextId = 0;
  @HostBinding() id: string = `lac-mat-tel-input-${LacMatTelInputComponent.nextId++}`;

  //placeholder
  private _placeholder: string;

  get placeholder(): string {
    return this._placeholder;
  };
  set placeholder(val) {
    this._placeholder = val;
    this.stateChanges.next();
  }

  //ngControl: NgControl; set with Dependency Injection

  focused: boolean = false;

  //controls the first value write for ngChange detections
  private firstChange: boolean = true;

  get empty(): boolean {
    return !this.phone;
  };

  //shouldLabelFloat: boolean;
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  //adds a required indicator to the label/placeholder
  private _required = false;
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private inputDisabled = false;
  @Input()
  get disabled(): boolean { return this.inputDisabled || this.ngControl.disabled; }
  set disabled(value: boolean) {
    this.inputDisabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  get errorState() {
    return this.ngControl && this.ngControl.errors !== null && !!this.ngControl.touched;
  }

  controlType?: string = 'mat-tel';

  autofilled?: boolean;


  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.onTouched();
    }
  }
  //Mat Form Field implementation - END

  //ControlValueAccessor - BEGIN
  writeValue(value: string): void {
    this.onInputChanged(value);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onTouched = () => {
  }

  propagateChange = (_: any) => {
  }
  //ControlValueAccessor - END

  private _internationalFormat = false;
  @Input()
  get internationalFormat() {
    return this._internationalFormat;
  }
  set internationalFormat(format) {
    this._internationalFormat = coerceBooleanProperty(format);
    this.onInputChanged(this.phone);
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef
  ) { 
     if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  //lifecycle
  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.countryChange.complete();
    this.stateChanges.complete();
  }

  onCountrySelected(code: CountryCode, noPhoneReset?: boolean) {
    let hasCountryChanged = this.selectedCountry && this.selectedCountry != code;
    this.selectedCountry = code;

    let example = getExampleNumber(code, Examples).formatNational();
    let numbersOnly = example.replace(/[^\d]/g, '');
    let maxExample = numbersOnly + '9999999999';

    this.maxInputLength = this.PhoneNumberMaxDigits;

    //find out the maximum (formatted) size a valid number for the country can have
    for (let i = maxExample.length; i >= 0; i--) {
      let test = maxExample.substring(0, i);
      let testPhone = parsePhoneNumberFromString(test, code);

      if (testPhone && testPhone.isValid()) {
        let maxInput = new AsYouType(code).input(test);
        this.maxInputLength = maxInput.length;
        this.placeholder = maxInput;//TODO set placeholder optionally
        break;
      }
    }

    //when new country is selected reset phone if phone reset was not disabled 
    if (hasCountryChanged && !noPhoneReset) {
      this.phone = '';
      this.value = this.phone;

      //focus on input
      if (this.phoneInput) {
        setTimeout(() => this.phoneInput.focus());
      }
    }
  }

  onInputChanged(e: string) {
    if (!e) {
      e = '';
    }
    
    this.phone = e;

    if (e.startsWith('+')) {//handles pasting of a complete international number
      try {
        let pastedNumber  = parsePhoneNumberFromString(e);

        if (pastedNumber && pastedNumber.country) {
          let code = pastedNumber.country;
          
          this.onCountrySelected(code, true);

          this.countryChange.next(code);

          setTimeout(() => {
            this.phone = pastedNumber.formatNational();
            this.value = this.phone;
          });
          return;
        }
      } catch {
      }
    }

    let numbersOnly = e.replace(/[^\d]/g, '');

    setTimeout(() => {
      let formatted = new AsYouType(this.selectedCountry).input(numbersOnly);
      //if the formatted output equals what we already have then the user is trying to delete a symbol inserted by
      //the formatted version
      this.phone = formatted.substr(0, formatted.length - 1) === this.phone ? numbersOnly : formatted;
      this.value = this.phone;
    }, 0);
  }

  public onInputKeyPress(event: KeyboardEvent): void {
		const allowedChars = /[0-9\+\-\ ]/;
		const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
		const allowedOtherKeys = [
			'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
			'Home', 'End', 'Insert', 'Delete', 'Backspace'
		];

		if (!allowedChars.test(event.key)
			&& !(event.ctrlKey && allowedCtrlChars.test(event.key))
			&& !(allowedOtherKeys.includes(event.key))) {
			event.preventDefault();
    }
	}

}
