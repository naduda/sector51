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

  constructor(login?: string, name?: string, surname?: string, phone?: string,
    email?: string, card?: string, role?: ERole, randomId?: boolean) {
    this.role = role || ERole.USER;
    this.authorities = ERole[this.role];
    this.login = login;
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
    this.card = card;
    this['created'] = new Date().getMilliseconds();
    if (randomId) {
      this['created'] -= Math.floor(Math.random() * 100);
    }
  }
}
