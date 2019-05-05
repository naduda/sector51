import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AFakeBackendInterceptor } from '../constants/fake-interceptor';
import { IAuthUser } from './auth-constant';

@Injectable()
export class AuthFakeBackendInterceptor extends AFakeBackendInterceptor {
  matchUrls(): string[] {
    return ['login'];
  }

  getFunctionByUrlAndMethod(request: HttpRequest<any>) {
    if (this.isRequestMatch(request, 'login', 'post')) {
      const users: IAuthUser[] = [
        { id: 1, name: 'test', password: 'test' }
      ];

      const user = users.find(x => x.name === request.body.name && x.password === request.body.password);
      if (!user) {
        return this.error('Username or password is incorrect');
      }
      return {
        id: user.id,
        name: user.name,
        token: `fake-jwt-token`
      };
    }

    return undefined;
  }
}
