const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./e2e/scripts/db.json');
const middlewares = jsonServer.defaults();
const userScript = require('./user.js');
const roleScript = require('./role.js');

const isAuthorized = (req) => {
  if (req.url === '/api/login') {
    return true;
  }
  const token = req.headers['x-auth-token'];
  if (!token) {
    return false;
  }
  const args = token.split('_');
  const user = router.db.get('usersecurity')
    .filter({ created: +args[0] }).value()[0];
  return user && (new Date().valueOf() < +args[1]);
};

server.use(middlewares);

server.use((req, res, next) => {
  if (isAuthorized(req)) {
    next();
  } else {
    res.sendStatus(401);
  }
});

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'GET') {
    if (req.url.includes('/api/profile/')) {
      const login = req.url.substring(req.url.lastIndexOf('/') + 1);
      const userInfo = router.db.get('userinfo').filter({ name: login }).value();
      res.jsonp(userScript.getUserById(+userInfo[0].created));
      return;
    }
    if (req.url.includes('/api/getUserById/')) {
      const id = req.url.substring(req.url.lastIndexOf('/') + 1);
      res.jsonp(userScript.getUserById(+id));
      return;
    }
  } else if (req.method === 'DELETE') {
    if (req.url.includes('/api/removeUser/')) {
      const id = req.url.substring(req.url.lastIndexOf('/') + 1);
      userScript.deleteUserById(+id);
      res.jsonp({ message: 'User ' + id + ' removed.', result: 'OK' });
      return;
    }
  }
  next()
});

server.get('/api/getRoles', (req, res) => res.jsonp(roleScript.roles()));
server.get('/api/getUsers', (req, res) => res.jsonp(userScript.users()));

server.post('/api/login', (req, res) => {
  const data = req.body;
  const userInfo = router.db.get('userinfo').filter({ name: data.username }).value();
  const user = userInfo.length != 1 ? undefined :
    router.db.get('usersecurity').filter({ created: userInfo[0].created, password: data.password }).value()[0];
  req.body = {token: user ? (user.created + '_' + (new Date().valueOf() + 24*60*60000)) : ''};
  router.db.set('login', req.body).write();
  res.jsonp(req.body);
});

server.post('/api/createUser', (req, res) => {
  userScript.createUser(req.body);
  res.jsonp({ message: 'User ' + req.body.login + ' created.', result: 'OK' });
});

server.put('/api/updateUser', (req, res) => {
  userScript.updateUser(req.body);
  res.jsonp({ message: 'User ' + req.body.login + ' updated.', result: 'OK' });
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');

  userScript.init(router.db);
  roleScript.init(router.db);
  
  console.log('Database created.')
});
