(function (app) {
  let db;

  app.init = (db) => {
    db.set('login', {}).write();
    db.set('usersecurity', []).write();
    db.set('userinfo', []).write();
    this.db = db;
    app.createUser({
      login: 'owner',
      password: 'owner',
      roles: 'OWNER',
      name: 'NameOwner',
      surname: 'SurnameOwner',
      phone: '+380501111112',
      email: 'owner@e2e.com',
      card: '0123456789876'
    });
  }

  app.createUser = (user) => {
    const createdTime = new Date().valueOf();
    app.insertUserSecurity({
      created: createdTime,
      username: user.login,
      password: user.password,
      roles: user.roles
    });
    app.insertUserInfo({
      created: createdTime,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      email: user.email,
      card: user.card
    });
  }

  app.insertUserSecurity = (user) => this.db.get('usersecurity').push(user).write();
  app.insertUserInfo = (user) => this.db.get('userinfo').push(user).write();

  app.users = () => {
    const users = this.db.get('userinfo').value();
    const usersSec = this.db.get('usersecurity').value();
    users.forEach((u) => {
      const us = usersSec.find(e => e.created === u.created);
      u.login = us.username;
      u.roles = us.roles;
    });
    return users;
  }

  return this;
})(this);
