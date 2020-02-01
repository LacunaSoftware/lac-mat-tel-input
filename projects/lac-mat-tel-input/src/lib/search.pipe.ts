import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(country: any, query?: any): any {
    if (!query || query === '') {
      return true;
    }

    return country.toLowerCase().includes(query.toLowerCase());
  }

}
