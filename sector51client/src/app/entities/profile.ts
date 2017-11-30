import { ERole, ESex } from '../entities/common';

export class Profile {
  readonly login: string;
  readonly name: string;
  readonly surname: string;
  readonly phone: string;
  email: string;
  authorities: string;
  card: string;
  role: ERole;
  sex: ESex | boolean;

  constructor(login?: string, name?: string, surname?: string, phone?: string,
    email?: string, card?: string, role?: ERole, sex?: ESex, randomId?: boolean) {
    this.role = role === undefined ? ERole.USER : role;
    this.authorities = ERole[this.role];
    this.login = login;
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
    this.card = card;
    this.sex = sex;
    this['created'] = new Date().getMilliseconds();
    if (randomId) {
      this['created'] -= Math.floor(Math.random() * 100);
    }
  }
}
