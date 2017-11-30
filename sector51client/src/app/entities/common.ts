export const STORAGE_NAME = 'sector';

export interface ILocale { name: string; text: string; ico: string; }
export interface IRole { id: number; name: string; }
export interface IProduct { id: number; name: string; desc: string; }
export interface IBarcode { code: string; time: string; }
export interface IModalProperties {
  header: string;
  headerClass?: string;
  body: string;
  bodyClass?: string;
  btOK: string;
  btCancel?: string;
}
export interface IModalWindow { btOkClick(props: IModalProperties): any; btCancelClick(reason: any): any; }

export enum ERole { OWNER = 0, ADMIN = 10, USER = 100 }
export enum ESex { MAN = 1, WOMAN = 0 }
