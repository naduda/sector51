import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { IAuthUser } from './auth-constant';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const users: IAuthUser[] = [
      { id: 1, name: 'test', password: 'test' }
    ];

    const authHeader = request.headers.get('Authorization');
    const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

    return of(null)
      .pipe(
        mergeMap(() => {
          if (request.url.endsWith('/login') && request.method === 'POST') {
            const user = users.find(x => x.name === request.body.name && x.password === request.body.password);
            if (!user) {
              return error('Username or password is incorrect');
            }
            return ok({
              id: user.id,
              name: user.name,
              token: `fake-jwt-token`
            });
          }

          if (request.url.endsWith('/users') && request.method === 'GET') {
            if (!isLoggedIn) {
              return unauthorised();
            }
            return ok(users);
          }

          return next.handle(request);
        })
      )
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function ok(body) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorised() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function error(message) {
      return throwError({ status: 400, error: { message } });
    }
  }
}
