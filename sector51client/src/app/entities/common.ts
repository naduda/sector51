export const STORAGE_NAME = 'sector';
export const RESERVED_PRODUCTS_ID = 100;

export interface ILocale { name: string; text: string; ico: string; }
export interface IRole { id: number; name: string; }
export interface IProduct { id: number; name: string; desc: string; count: number; price: number; code: string; }
export interface IBarcode { productId: number; code: string; }
export interface IModalProperties {
  header: string;
  headerClass?: string;
  body: string;
  bodyClass?: string;
  btOK: string;
  btCancel?: string;
}
export interface IModalWindow {
  btOkClick(instance: any): any;
  btCancelClick(reason: any, instance: any): any;
  init(props: any): void;
}
export interface IResponse { result: string; message: any; }

export enum ERole { OWNER = 0, ADMIN = 10, USER = 100 }
export enum ESex { MAN = 1, WOMAN = 0 }
export enum ERestResult { OK, ERROR, NOT_DENIED, USER_ALREADY_EXIST }
