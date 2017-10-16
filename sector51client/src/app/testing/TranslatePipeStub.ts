import { Pipe, PipeTransform, OnInit } from '@angular/core';
import * as translation from '../../assets/i18n/uk.json';

@Pipe({name: 'translate'})
export class TranslatePipeStub implements PipeTransform {

  transform(query: string, ...args: any[]): any {
    const qs = query.split('.');
    let result = translation[qs[0]];
    for (let i = 1; i < qs.length; i++) {
      result = result[qs[i]];
    }
    return result;
  }
}
