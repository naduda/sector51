import { IUserService } from './common';

export const REST_API = {
  DELETE: {
    /** /api/delete/productById/{id} */
    productById: (id): string => '/api/delete/productById/' + id,
    /** /api/delete/userById/{idUser} */
    userById: (id): string => '/api/delete/userById/' + id,
    /** /api/delete/boxType/{id} */
    boxtype: (id): string => '/api/delete/boxType/' + id,
    /** /api/delete/boxNumber/{idtype_number} */
    boxnumber: (idtype, num) => '/api/delete/boxNumber/' + idtype + '_' + num,
    /** /api/delete/userservice */
    userService: (us: IUserService) => '/api/delete/userservice/' + us.idUser + '_' + us.idService
  },
  GET: {
    /** /api/public/usersNotExist*/
    usersNotExist: '/api/public/usersNotExist',
    /** /api/barcodeByCode/{code} { params: productId }*/
    barcodeByCode: (code): string => '/api/barcodeByCode/' + code,
    /** /api/products */
    products: '/api/products',
    /** /api/profileByName/{name} */
    profileByName: (name): string => '/api/profileByName/' + name,
    /** /api/public/roles */
    roles: '/api/public/roles',
    /** /api/userByCard/{card} */
    userByCard: (card: string): string => '/api/userByCard/' + card,
    /** /api/userById/{id} */
    userById: (id): string => '/api/userById/' + id,
    /** /api/users */
    users: '/api/users',
    /** /api/boxtypes */
    boxtypes: '/api/boxtypes',
    /** /api/boxnumbers */
    boxnumbers: '/api/boxnumbers',
    /** /api/services */
    services: '/api/services',
    /** /api/userservices/{idUser: Timestamp} */
    userServices: (idUser: number) => '/api/userservices/' + idUser,
    /** /api/history */
    history: (dtBeg: Date, dtEnd: Date) => '/api/history/' + dtBeg.getTime() + '_' + dtEnd.getTime(),
    /** /api/events */
    events: '/api/events'
  },
  POST: {
    /** /api/login { body: UserSecurity }*/
    login: '/api/public/login',
    /** /api/add/product */
    product: '/api/add/product',
    /** /api/add/user */
    user: '/api/add/user',
    /** /api/public/add/firstUser */
    firstUser: '/api/public/add/firstUser',
    /** /api/add/userPay { body: [user, products, cash] }*/
    userPay: '/api/add/userPay',
    /** /api/add/boxType { body: name }*/
    boxtype: '/api/add/boxType',
    /** /api/add/boxNumber { body: name }*/
    boxnumber: '/api/add/boxNumber',
    /** /api/add/userservice { userService: value }*/
    userService: '/api/add/userservice'
  },
  PUT: {
    /** /api/update/product*/
    product: '/api/update/product',
    /** /api/update/user */
    user: '/api/update/user',
    /** /api/update/boxType */
    boxtype: '/api/update/boxType',
    /** /api/update/boxNumber */
    boxnumber: '/api/update/boxNumber',
    /** /api/update/userservice */
    userService: '/api/update/userservice',
    /** /api/update/service */
    service: '/api/update/service'
  }
};
