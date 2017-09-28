import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate'})
export class TranslatePipeStub implements PipeTransform {
  transform(query: string, ...args: any[]): any {
    return query + '_translated';
  }
}
