export const REST_API = {
  DELETE: {
    /** /api/delete/productById/{id} */
    productById: (id): string => '/api/delete/productById/' + id,
    /** /api/delete/userById/{idUser} */
    userById: (id): string => '/api/delete/userById/' + id,
    /** /api/delete/boxType/{id} */
    boxtype: (id): string => '/api/delete/boxType/' + id,
    /** /api/delete/boxNumber/{idtype_number} */
    boxnumber: (idtype, num) => '/api/delete/boxNumber/' + idtype + '_' + num
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
    boxnumbers: '/api/boxnumbers'
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
    /** /api/boxType { body: name }*/
    boxtype: '/api/add/boxType',
    /** /api/boxNumber { body: name }*/
    boxnumber: '/api/add/boxNumber'
  },
  PUT: {
    /** /api/update/product*/
    product: '/api/update/product',
    /** /api/update/user */
    user: '/api/update/user',
    /** /api/update/boxType */
    boxtype: '/api/update/boxType',
    /** /api/update/boxNumber */
    boxnumber: '/api/update/boxNumber'
  }
};
