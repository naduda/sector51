export const AUTH_CONST = {
  STORAGE_NAME: 'SECTOR_STORAGE'
};

export interface IAuthUser {
  id: any;
  name: string;
  password: string;
  token?: string;
}
