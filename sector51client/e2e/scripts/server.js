const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./e2e/scripts/db.json');
const middlewares = jsonServer.defaults();

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
  if (req.method === 'POST') {
    if (req.url === '/api/login') {
      const data = req.body;
      const user = router.db.get('usersecurity')
        .filter({ username: data.username, password: data.password }).value()[0];
      req.body = {token: user ? (user.created + '_' + (new Date().valueOf() + 600000)) : ''};
      router.db.set('login', req.body).write();
    }
  } else if (req.method === 'GET') {
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
  }
  next()
});

server.get('/api/getRoles', (req, res) => {
  res.jsonp(router.db.get('roles'));
});

server.get('/api/getUsers', (req, res) => {
  const users = router.db.get('userinfo').value();
  const usersSec = router.db.get('usersecurity').value();
  for(let u of users) {
    const us = usersSec.find(e => e.created === u.created);
    u.login = us.username;
    u.roles = us.roles;
  }
  res.jsonp(users);
});

server.use('/api', router);
server.listen(3000, () => {
  console.log('JSON Server is running');
  const createdTime = new Date().valueOf();
  router.db.set('login', {}).write();
  router.db.set('usersecurity', [{
    'created': createdTime,
    'username': 'owner',
    'password': 'owner',
    'roles': 'OWNER'
  }]).write();
  router.db.set('userinfo', [{
    'created': createdTime,
    'name': 'NameOwner',
    'surname': 'SurnameOwner',
    'phone': '+380501111112',
    'email': 'owner@e2e.com',
    'card': '0123456789876'
  }]).write();
  router.db.set('roles', [
    {"key": 0,"value": "OWNER"},
    {"key": 10,"value": "ADMIN"},
    {"key": 100,"value": "USER"}
  ]).write();
  console.log('Database created.')
});
