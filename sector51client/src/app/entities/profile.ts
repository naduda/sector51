export class Profile {
  login: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  authorities: string
  card: string;
  password: string;

  constructor() {
    this.authorities = '';
  }
}
