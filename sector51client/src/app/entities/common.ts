export const STORAGE_NAME = 'sector';

export interface ILocale { name: string; text: string; ico: string; }
export interface IRole { id: number; name: string; }

export enum ERole { OWNER = 0, ADMIN = 10, USER = 100 }

export enum ESex { MAN = 1, WOMAN = 0 }
