# Lacuna International Telephone Input for Angular Material (LacMatTelInput)

An Angular Material package for entering and validating international telephone numbers. 

This is a partial rewrite of [tanansatpal's ngx-mat-intl-tel-input] (https://github.com/tanansatpal/ngx-mat-intl-tel-input) which was the best angular material component I could find for this purpose 
but I felt that the structure of the component needded too many changes.

Main features: 

- Country Selector with flag
- Auto formatting when user types phone
- Applies max length according with the country selected
- Output is formatted (digits only coming soon)
- Phone validator for Reactive Forms
- Automatically sets country when user pastes phone with the country's dial code

**Supports:**

- Angular 9
- Angular Material 9
- ReactiveFormsModule
- FormsModule
- Validation with [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js)

## Installation

### Install Dependencies

```$ npm install libphonenumber-js --save```

### Install This Library

```$ npm install lac-mat-tel-input --save```

## Usage

### Import

Add ```LacMatTelInputModule``` to your module file:

```javascript

imports: [
    LacMatTelInputModule,
  ]

```

## Example

You can find a complete Stackblitz sample [here](https://stackblitz.com/edit/lac-mat-tel-input-sample).

```html

<form [formGroup]="form">
	<mat-form-field>
		<mat-label>Phone</mat-label>
		<lac-mat-country-selector matPrefix [selectorFor]="input"></lac-mat-country-selector>
		<lac-mat-tel-input #input formControlName="phone"></lac-mat-tel-input>
		<mat-error *ngIf="form.controls['phone']?.errors?.invalidPhone">Invalid phone</mat-error>
    </mat-form-field>
</form>

```

```html

<form [formGroup]="form">
	<mat-form-field>
		<mat-label>Phone</mat-label>
		<lac-mat-country-selector matPrefix [selectorFor]="input"
			[preferredCountries]="['us', 'gb']"
			[onlyCountries]="['us', 'gb', 'es']"
			[showDialCode]="false"
			[disableSearch]="false"
			searchPlaceholder="Search..."
			(change)="onCountryChange($event)">
		</lac-mat-country-selector>
		<lac-mat-tel-input #input formControlName="phone">
		</lac-mat-tel-input>
    </mat-form-field>
</form>

```

## Options

| Options                       | Type                   | Default            | Description                                                                         |
| ------------------------------|------------------------|--------------------|-------------------------------------------------------------------------------------|
| preferredCountries            | ```string[]```         | ```[]```           | List of country abbreviations, which will appear at the top.                        |
| onlyCountries                 | ```string[]```         | ```[]```           | List of manually selected country abbreviations, which will appear in the dropdown. |
| showDialCode             		| ```boolean```          | ```false```        | Shows the country's dial code next to the flag                      				|
| disableSearch                 | ```boolean```          | ```false```        | Whether to disable the search bar to help filter down the list of countries         |
| searchPlaceholder             | ```string```           | ```null```         | The placeholder to display in the search bar 										|
| internationalFormat           | ```boolean```          | ```false```        | By default, phone numbers will be formated using the [AsYouType](https://github.com/catamphetamine/libphonenumber-js/#as-you-type-formatter) formatter. However, if you wish to use [INTERNATIONAL](https://github.com/catamphetamine/libphonenumber-js/#phonenumber) format set this to `true`										|

## Library Contributions

- Fork repo.
- Go to ```./projects/lac-mat-tel-input```
- Update ```./src/lib``` with new functionality.
- Update README.md
- Pull request.

### Helpful commands

- Build lib: ```$ npm run build_lib```
- Copy license and readme files: ```$ npm run copy-files```
- Create package: ```$ npm run npm_pack```
- Build lib and create package: ```$ npm run package```

### Use locally

After building and creating package, you can use it locally too.

In your project run:

```$ npm install --save {{path to your local '*.tgz' package file}}```
