import { Pipe, PipeTransform } from '@angular/core';
import * as translation from '../../assets/i18n/uk.json';

@Pipe({name: 'translate'})
export class TranslatePipeStub implements PipeTransform {
  static translate(query: string): string {
    if (query === undefined) {
      return null;
    }
    const qs = query.split('.');
    let result = translation[qs[0]];
    for (let i = 1; i < qs.length; i++) {
      result = result[qs[i]];
    }
    return result || query;
  }

  transform(query: string, ...args: any[]): any {
    return TranslatePipeStub.translate(query);
  }
}
