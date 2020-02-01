import { Component, OnInit, OnDestroy, HostBinding, Input, Optional, Self, ElementRef, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MatFormFieldControl, MatInput } from '@angular/material';
import { Subject } from 'rxjs';
import { NgControl, NgModel } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getExampleNumber, parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { CountryCode as LibCountryCode }  from 'libphonenumber-js';
import { Examples, CountryCode } from './data/country-code';
import { Country } from './model/country.model';

@Component({
  selector: 'lac-mat-tel-input',
  templateUrl: './lac-mat-tel-input.component.html',
  styleUrls: ['./lac-mat-tel-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: LacMatTelInputComponent}, CountryCode]
})
export class LacMatTelInputComponent implements OnInit, OnDestroy, MatFormFieldControl<any> {

  phone: string;
  maxInputLength: number = 20;
  private get countryCode(): LibCountryCode {
    return <LibCountryCode> this.selectedCountry.flagClass;
  }

  allCountries: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];
  selectedCountry: Country;

  @ViewChild('phoneInput') phoneInput: MatInput;


  @Input() preferredCountries: Array<string> = [];
  @Input() onlyCountries: Array<string> = [];
  @Output()
  countryChanged: EventEmitter<Country> = new EventEmitter<Country>();

  //Mat Form Field implementation - BEGIN
  stateChanges = new Subject<void>();

  //the value of the FormFieldControl
  value: any;//whenever value changes -> this.stateChanges.next(); so form-field runs change detection

  //the id of an element to associate labels and hints with.
  static nextId = 0;
  @HostBinding() id: string = `lac-mat-tel-input-${LacMatTelInputComponent.nextId++}`;

  //placeholder
  private _placeholder: string;
  @Input()
  get placeholder(): string {
    return this._placeholder;
  };
  set placeholder(val) {
    this._placeholder = val;
    this.stateChanges.next();
  }

  //ngControl: NgControl; set with Dependency Injection

  focused: boolean = false;

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
  get disabled(): boolean { return this.inputDisabled; }
  set disabled(value: boolean) {
    this.inputDisabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  //TODO
  errorState: boolean = false;

  controlType?: string = 'mat-tel';

  autofilled?: boolean;


  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    //TODO
    
  }
  //Mat Form Field implementation - END

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private countryCodeData: CountryCode,
    private elRef: ElementRef<HTMLElement>,
    private changeDetector: ChangeDetectorRef
  ) { 
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this.fetchCountryData();
  }

  //builds the All Countries array
  protected fetchCountryData(): void {
    this.countryCodeData.allCountries.forEach(c => {
      const country: Country = {
        name: c[0].toString(),
        iso2: c[1].toString(),
        dialCode: c[2].toString(),
        priority: +c[3] || 0,
        areaCodes: c[4] as string[] || undefined,
        flagClass: c[1].toString().toUpperCase(),
        placeHolder: ''
      };

      // if (this.enablePlaceholder) {
      //   country.placeHolder = NgxMatIntlTelInputComponent.getPhoneNumberPlaceHolder(country.iso2.toUpperCase());
      // }

      this.allCountries.push(country);
    });
  }

  //lifecycle
  ngOnInit() {
    //build preferred countries arrays if they are specified
    if (this.preferredCountries.length) {
      this.preferredCountries.forEach(iso2 => {
        const preferredCountry = this.allCountries.filter((c) => {
          return c.iso2 === iso2;
        });
        this.preferredCountriesInDropDown.push(preferredCountry[0]);
      });
    }

    //filter countries if required
    if (this.onlyCountries.length) {
      this.allCountries = this.allCountries.filter(c => this.onlyCountries.includes(c.iso2));
    }

    //set the default selected a country
    if (this.preferredCountriesInDropDown.length) {
      this.selectedCountry = this.preferredCountriesInDropDown[0];
    } else {
      this.selectedCountry = this.allCountries[0];
    }

    this.selectCountry(this.selectedCountry);
  }

  ngOnDestroy(): void {
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.stateChanges.complete();
  }

  selectCountry(country: Country, noPhoneReset?: boolean) {
    let hasCountryChanged = this.selectedCountry.iso2 != country.iso2;
    this.selectedCountry = country;

    let code = this.countryCode;
    let example = getExampleNumber(code, Examples).formatNational();
    let numbersOnly = example.replace(/[^\d]/g, '');
    let maxExample = numbersOnly + '9999999999';

    this.maxInputLength = 20;

    //find out the maximum (formatted) size a valid number for the country can have
    for (let i = maxExample.length; i >= 0; i--) {
      let test = maxExample.substring(0, i);
      let testPhone = parsePhoneNumberFromString(test, code);

      //TODO consider only national
      if (testPhone && testPhone.isValid()) {
        let maxInput = new AsYouType(code).input(test);
        this.maxInputLength = maxInput.length;
        this.placeholder = maxInput;
        console.log('Max length is', this.maxInputLength);//TODO remove
        break;
      }
    }

    //when new country is selected reset phone if phone reset was not disabled 
    if (hasCountryChanged && !noPhoneReset) {
      this.phone = '';

      //focus on input
      if (this.phoneInput) {
        setTimeout(() => this.phoneInput.focus());
      }
    }

    // if (this.elRef.nativeElement.lastChild) {
    //   let input = this.elRef.nativeElement.lastChild as HTMLInputElement;
    //   console.log(input);
    //   input.focus();
    //   this.changeDetector.detectChanges();
    // }

    this.countryChanged.emit(this.selectedCountry);
  }

  onInputChanged(e: string) {
    this.phone = e;

    if (e.startsWith('+')) {//handles pasting of a complete international number
      try {
        let pastedNumber  = parsePhoneNumberFromString(e);

        if (pastedNumber && pastedNumber.country) {
          console.log('pasted country', pastedNumber.country);//TODO remove
          let phoneCountry = this.allCountries.filter((c) => {
            return c.flagClass === pastedNumber.country.toString();
          });

          if (phoneCountry.length) {
            console.log('selected:', phoneCountry);//TODO remove
            this.selectCountry(phoneCountry[0], true);
            setTimeout(() => {
              this.phone = pastedNumber.formatNational();
            });
            return;
          }
        }
      } catch {
      }
    }

    let numbersOnly = e.replace(/[^\d]/g, '');

    setTimeout(() => {
      let formatted = new AsYouType(this.countryCode).input(numbersOnly);
      //if the formatted output equals what we already have then the user is trying to delete a symbol inserted by
      //the formatted version
      console.log('formatted: ' + formatted);
      console.log('fm2: ' + parsePhoneNumberFromString(numbersOnly));
      this.phone = formatted.substr(0, formatted.length - 1) === this.phone ? numbersOnly : formatted;

      //TODO should I be doing this?
      this.value = this.phone;
      this.stateChanges.next(this.value);
      
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
