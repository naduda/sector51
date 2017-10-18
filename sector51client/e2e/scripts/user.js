(function (app) {
  let db;

  app.init = (db) => {
    db.set('login', {}).write();
    const u = db.get('usersecurity').filter({username: 'owner'}).value();
    const ui = db.get('userinfo').filter({created: u[0].created}).value();
    db.set('usersecurity', u).write();
    db.set('userinfo', ui).write();
    this.db = db;
    if (u.length > 0) {
      return;
    }
    app.createUser({
      login: 'owner',
      password: 'owner',
      roles: 'OWNER',
      name: 'NameOwner',
      surname: 'SurnameOwner',
      phone: '+380501111112',
      email: 'owner@e2e.com',
      card: '0123456789876',
      sex: true
    });
  }

  app.createUser = (user, time) => {
    const createdTime = time || new Date().valueOf();
    this.db.get('usersecurity').push({
      created: createdTime,
      username: user.login,
      password: user.password,
      roles: user.roles
    }).write();

    this.db.get('userinfo').push({
      created: createdTime,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      email: user.email,
      card: user.card,
      sex: user.sex
    }).write();
  }

  app.deleteUser = (user) => {
    this.db.get('usersecurity').remove({ created: +user.created }).write();
    this.db.get('userinfo').remove({ created: +user.created }).write();
  }

  app.updateUser = (user) => {
    let u = this.db.get('usersecurity').filter({ created: +user.created }).value();
    app.deleteUser(user);
    user.password = u[0].password;
    app.createUser(user, user.created);
  }

  app.deleteUserById = (id) => {
    this.db.get('usersecurity').remove({ created: id }).write();
    this.db.get('userinfo').remove({ created: id }).write();
  }

  app.users = () => {
    const users = this.db.get('userinfo').value();
    const userSecurity = this.db.get('usersecurity').value();
    const result = [];
    users.forEach((userInfo) => {
      const user = userSecurity.find(e => e.created === userInfo.created);
      result.push({
        created: user.created,
        login: user.username,
        roles: user.roles,
        name: userInfo.name,
        surname: userInfo.surname,
        phone: userInfo.phone,
        email: userInfo.email,
        card: userInfo.card,
        sex: userInfo.sex
      });
    });
    return result;
  }

  app.getUserById = (id) => {
    const userInfo = this.db.get('userinfo')
      .filter({ created: +id }).value();
    if (userInfo.length < 1) {
      return null;
    }
    const user = this.db.get('usersecurity')
      .filter({ created: +id }).value()[0];

    return {
      created: user.created,
      login: user.username,
      roles: user.roles,
      name: userInfo[0].name,
      surname: userInfo[0].surname,
      phone: userInfo[0].phone,
      email: userInfo[0].email,
      card: userInfo[0].card,
      sex: userInfo[0].sex
    };
  }

  app.getUserByLogin = (login) => {
    const user = this.db.get('usersecurity').filter({ username: login }).value();
    if (user.length < 1) {
      return null;
    }
    return app.getUserById(+user[0].created);
  }

  return this;
})(this);
