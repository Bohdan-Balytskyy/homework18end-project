import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumFormat'
})
export class SumFormatPipe implements PipeTransform {

  transform(value: number): string {
    return (+value.toFixed(2)).toLocaleString();
  }

}
