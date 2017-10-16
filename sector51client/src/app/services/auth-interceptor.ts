import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = { 'X-Auth-Token': this.auth.token };
    const clone = req.clone({ setHeaders: headers });
    const started = Date.now();
    return next.handle(clone)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        }
      })
      .catch(ex => {
        if ((ex instanceof HttpErrorResponse) && ex.status === 403) {
          this.auth.logout();
        }
        return Observable.throw(ex);
      });
  }
}
