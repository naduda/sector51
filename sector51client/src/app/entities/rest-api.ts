import { IUserService } from './common';

const ROOT = 'api';
export const REST_API = {
  DELETE: {
    /** /api/delete/productById/{id} */
    productById: (id): string => ROOT + '/delete/productById/' + id,
    /** /api/delete/userById/{idUser} */
    userById: (id): string => ROOT + '/delete/userById/' + id,
    /** /api/delete/boxType/{id} */
    boxtype: (id): string => ROOT + '/delete/boxType/' + id,
    /** /api/delete/boxNumber/{idtype_number} */
    boxnumber: (idtype, num) => ROOT + '/delete/boxNumber/' + idtype + '_' + num,
    /** /api/delete/userservice */
    userService: (us: IUserService) => ROOT + '/delete/userservice/' + us.idUser + '_' + us.idService
  },
  GET: {
    /** /api/public/usersNotExist*/
    usersNotExist: ROOT + '/public/usersNotExist',
    /** /api/barcodeByCode/{code} { params: productId }*/
    barcodeByCode: (code): string => ROOT + '/barcodeByCode/' + code,
    /** /api/products */
    products: ROOT + '/products',
    /** /api/profileByName/{name} */
    profileByName: (name): string => ROOT + '/profileByName/' + name,
    /** /api/public/roles */
    roles: ROOT + '/public/roles',
    /** /api/userByCard/{card} */
    userByCard: (card: string): string => ROOT + '/userByCard/' + card,
    /** /api/userById/{id} */
    userById: (id): string => ROOT + '/userById/' + id,
    /** /api/users */
    users: ROOT + '/users',
    /** /api/boxtypes */
    boxtypes: ROOT + '/boxtypes',
    /** /api/boxnumbers */
    boxnumbers: ROOT + '/boxnumbers',
    /** /api/services */
    services: ROOT + '/services',
    /** /api/userservices/{idUser: Timestamp} */
    userServices: (idUser: number) => ROOT + '/userservices/' + idUser,
    /** /api/history */
    history: (dtBeg: Date, dtEnd: Date) => ROOT + '/history/' + dtBeg.getTime() + '_' + dtEnd.getTime(),
    /** /api/events */
    events: ROOT + '/events'
  },
  POST: {
    /** /api/userWithServices { body: rows }*/
    userWithServices: ROOT + '/add/userWithServices',
    /** /api/scanner?code=1234567898765 */
    scanner: (code) => ROOT + '/scanner?code=' + code,
    /** /api/login { body: UserSecurity }*/
    login: ROOT + '/public/login',
    /** /api/add/product */
    product: ROOT + '/add/product',
    /** /api/add/user */
    user: ROOT + '/add/user',
    /** /api/public/add/firstUser */
    firstUser: ROOT + '/public/add/firstUser',
    /** /api/add/userPay { body: [user, products, cash] }*/
    userPay: ROOT + '/add/userPay',
    /** /api/add/boxNumber { body: name }*/
    boxnumber: ROOT + '/add/boxNumber',
    /** /api/add/userservice { userService: value }*/
    userService: ROOT + '/add/userservice'
  },
  PUT: {
    /** /api/update/product*/
    product: ROOT + '/update/product',
    /** /api/update/user */
    user: ROOT + '/update/user',
    /** /api/update/boxType */
    boxtype: ROOT + '/update/boxType',
    /** /api/update/boxNumber */
    boxnumber: ROOT + '/update/boxNumber',
    /** /api/update/userservice */
    userService: ROOT + '/update/userservice',
    /** /api/update/service */
    service: ROOT + '/update/service',
    /** /api/update/events/{userId_field} */
    events: (userId_field) => ROOT + '/update/events/' + userId_field
  }
};
