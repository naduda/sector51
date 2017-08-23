export class Profile {
  private _login: string;
  private _name: string;
  private _surname: string;
  private _phone: string;
  private _email: string;
  private _authorities: string
  private _card: string;

  constructor(){
    this._authorities = '';
  }

  setup(name: string): Profile {
    this._name = name;
    this._surname = 'surname';
    return this;
  }

  get login(): string {
    return this._login;
  }

  get name(): string {
    return this._name;
  }

  get surname(): string {
    return this._surname;
  }

  get phone(): string {
    return this._phone;
  }

  get email(): string {
    return this._email;
  }

  get authorities(): string {
    return this._authorities;
  }

  get card(): string {
    return this._card;
  }
}