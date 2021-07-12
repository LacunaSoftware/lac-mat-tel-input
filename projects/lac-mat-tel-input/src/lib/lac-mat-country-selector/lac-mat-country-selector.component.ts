import { Component, OnInit, Input, EventEmitter, OnDestroy, Output, ViewEncapsulation, ViewChild } from '@angular/core';
import { Country } from '../model/country.model';
import { CountryCode } from '../data/country-code';
import { CountryCode as LibCountryCode }  from 'libphonenumber-js';
import { LacMatTelInputComponent } from '../lac-mat-tel-input.component';
import { Observable, Subscription } from 'rxjs';
import { MatInput } from '@angular/material';

@Component({
  selector: 'lac-mat-country-selector',
  templateUrl: './lac-mat-country-selector.component.html',
  styleUrls: ['./lac-mat-country-selector.component.scss'],
  providers: [CountryCode],
  encapsulation: ViewEncapsulation.None
})
export class LacMatCountrySelectorComponent implements OnInit, OnDestroy {

  @Input() 
  selectorFor: LacMatTelInputComponent;
  @Input() 
  preferredCountries: Array<string> = [];
  @Input() 
  onlyCountries: Array<string> = [];
  @Input()
  showDialCode?: boolean;
  @Input()
  disableSearch?: boolean;
  @Input()
  searchPlaceholder?: string;
  @Input()
  maxHeightCountriesContainer?: number;

  @Output()
  change: EventEmitter<Country> = new EventEmitter<Country>();

  selectedCountry: Country;
  allCountries: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];

  get disabled() : boolean {
    return this.selectorFor && this.selectorFor.disabled;
  }
  
  searchQuery: string;
  @ViewChild('searchInput') searchInput: MatInput;

  private countrySubscription: Subscription;

  constructor(
    private countryCodeData: CountryCode
  ) { 
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

      this.allCountries.push(country);
    });
  }

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
    let defaultCountry: Country;
    if (this.preferredCountriesInDropDown.length) {
      defaultCountry = this.preferredCountriesInDropDown[0];
    } else {
      defaultCountry = this.allCountries[0];
    }

    if (this.selectorFor) {
      this.countrySubscription = this.selectorFor.countryChange.subscribe(c => this.onCountryUpdateFromInput(c));
    }

    this.selectCountry(defaultCountry);
  }

  ngOnDestroy() {
    if (this.countrySubscription) {
      this.countrySubscription.unsubscribe();
    }
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;

    if (this.selectorFor) {
      this.selectorFor.onCountrySelected(<LibCountryCode> country.flagClass);
    }
    this.change.next(country);
  }

  private onCountryUpdateFromInput(code: LibCountryCode) {
    let country = this.allCountries.find((c) => {
      return c.flagClass === code.toString();
    });

    this.selectedCountry = country;
    this.change.next(country);
  }

  onOpenMenuClick() {
    if (!this.disableSearch && this.searchInput) {
      setTimeout(() => this.searchInput.focus());
    }
  }

  onMenuClosed() {
    this.searchQuery = '';
  }

}
