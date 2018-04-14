export const STORAGE_NAME = 'sector';
export const RESERVED_PRODUCTS_ID = 100;

export interface ILocale { name: string; text: string; ico: string; }
export interface IRole { id: number; name: string; }
export interface IProduct { id: number; name: string; desc: string; count: number; price: number; code: string; }
export interface IBarcode { productId: number; code: string; }
export interface IModalProperties {
  header: string;
  headerParam: any;
  headerClass?: string;
  body: string;
  bodyClass?: string;
  btOK: string;
  btCancel?: string;
}
export interface IModalWindow {
  btOkClick(instance: any, onSuccess?: any): any;
  btCancelClick(reason: any, instance: any): any;
  init(props: any): void;
}
export interface ITableColumn { field: string; header: string; }
export interface IBox { idtype: number; number: number; card?: string; time?: Date; }
export interface IResponse { result: string; message: any; }
export interface IService { id: number; name: string; desc: string; price: number; }
export interface IUserService {
  idService: number;
  desc: string;
  idUser: number;
  dtBeg: Date;
  dtEnd: Date;
  value: string;
}
export interface IHistory {
  id: number;
  idEvent: number;
  idUser: number;
  time: number;
  desc: string;
  price: number;
  income: number;
  outcome: number;
  usercome: number;
}
export interface IEvent { id: number; name: string; desc: string; email: string; }
export interface ITableExport { header: string; field: string; }

export enum ERole { OWNER = 0, ADMIN = 10, USER = 100, SELDER = 125, TRAINER = 150 }
export enum ESex { MAN = 1, WOMAN = 0 }
export enum ERestResult { OK, ERROR, NOT_DENIED, USER_ALREADY_EXIST }
