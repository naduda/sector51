import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '../entities/profile';

@Pipe({
  name: 'sortusers'
})
export class SortusersPipe implements PipeTransform {

  transform(array: Array<Profile>, args: string): Array<Profile> {
    array.sort((a: Profile, b: Profile) => {
      if (a.surname < b.surname) {
        return -1;
      } else if (a.surname > b.surname) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
