export const REST_API = {
  DELETE: {
    /** /api/delete/productById/{id} */
    productById: (id): string => '/api/delete/productById/' + id,
    /** /api/delete/userById/{idUser} */
    userById: (id): string => '/api/delete/userById/' + id
  },
  GET: {
    /** /api/barcode/{code} { params: productId }*/
    barcodeByCode: (code): string => '/api/barcodeByCode/' + code,
    /** /api/products */
    products: '/api/products',
    /** /api/profileByName/{name} */
    profileByName: (name): string => '/api/profileByName/' + name,
    /** /api/roles */
    roles: '/api/roles',
    /** /api/userByCard/{card} */
    userByCard: (card): string => '/api/userByCard/' + card,
    /** /api/userById/{id} */
    userById: (id): string => '/api/userById/' + id,
    /** /api/users */
    users: '/api/users'
  },
  POST: {
    /** /api/login */
    login: '/api/login',
    /** /api/add//product */
    product: '/api/add/product',
    /** /api/add//user */
    user: '/api/add//user'
  },
  PUT: {
    /** /api/update/product { params: oldProductId } */
    product: '/api/update/product',
    /** /api/update/user */
    user: '/api/update/user'
  }
};
