(function (app) {
  let db;

  app.init = (db) => {
    db.set('roles', []).write();
    this.db = db;
    app.insertRoles([
      { key: 0, value: 'OWNER' },
      { key: 10, value: 'ADMIN' },
      { key: 100, value: 'USER' }
    ]);
  }

  app.inserRole = (role) => this.db.get('roles').push(role).write();
  app.insertRoles = (roles) => roles.forEach(role => app.inserRole(role));
  app.roles = () => this.db.get('roles').value();

  return this;
})(this);
