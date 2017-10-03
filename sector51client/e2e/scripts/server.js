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
      const name = req.url.substring(req.url.lastIndexOf('/') + 1);
      const user = router.db.get('usersecurity')
        .filter({ username: name }).value()[0];
      const userInfo = router.db.get('userinfo')
        .filter({ created: user.created }).value()[0];
      userInfo.roles = user.roles;
      userInfo.login = user.username;
      res.jsonp(userInfo);
      return;
    }
    if (req.url.includes('/api/getUserById/')) {
      const id = req.url.substring(req.url.lastIndexOf('/') + 1);
      const userInfo = router.db.get('userinfo')
        .filter({ created: id }).value();
      if (userInfo.length < 1) {
        res.jsonp(null);
        return;
      }
      const user = router.db.get('usersecurity')
        .filter({ created: id }).value()[0];
      userInfo[0].roles = user.roles;
      userInfo[0].login = user.username;
      res.jsonp(userInfo);
      return;
    }
  }
  next()
});

server.get('/api/getRoles', (req, res) => res.jsonp(roleScript.roles()));
server.get('/api/getUsers', (req, res) => res.jsonp(userScript.users()));

server.post('/api/login', (req, res) => {
  const data = req.body;
  const user = router.db.get('usersecurity')
    .filter({ username: data.username, password: data.password }).value()[0];
  req.body = {token: user ? (user.created + '_' + (new Date().valueOf() + 600000)) : ''};
  router.db.set('login', req.body).write();
  res.jsonp(req.body);
});

server.post('/api/createUser', (req, res) => {
  userScript.createUser(req.body);
  res.jsonp({ message: 'User ' + req.body.login + ' created.', result: 'OK' });
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');

  userScript.init(router.db);
  roleScript.init(router.db);
  
  console.log('Database created.')
});
