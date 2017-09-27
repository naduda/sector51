import { ERole } from '../entities/common';

export class Profile {
  login: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  authorities: string;
  card: string;
  role: ERole;

  constructor() {
    this.authorities = '';
  }
}
