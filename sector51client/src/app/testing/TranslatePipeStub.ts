import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate'})
export class TranslatePipeStub implements PipeTransform {
  transform(query: string, ...args: any[]): any {
    const qs = query.split('.');
    let result = Translation.value;
    for (const q of qs) {
      if (!result) {
        return query;
      }
      result = result[q];
    }
    return result;
  }
}

export class Translation {
  static value: any = {};
};
