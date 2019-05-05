import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

@Injectable()
export abstract class AFakeBackendInterceptor implements HttpInterceptor {
  protected isLoggedIn: boolean;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isNotMatch(request.url)) {
      return next.handle(request);
    }

    const authHeader = request.headers.get('Authorization');
    this.isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

    return this.of(null)
      .pipe(
        mergeMap(() => {
          const loginRequest = request.url.endsWith('/login') && request.method === 'POST';
          if (!this.isLoggedIn && !loginRequest) {
            return this.unauthorised();
          }

          const func = this.getFunctionByUrlAndMethod(request);
          if (func) {
            return this.ok(func);
          }

          return next.handle(request);
        })
      )
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }

  private of(content) {
    return of(content);
  }

  private ok(body) {
    return this.of(new HttpResponse({ status: 200, body }));
  }

  private unauthorised() {
    return throwError({ status: 401, error: { message: 'Unauthorised' } });
  }

  protected error(message) {
    return throwError({ status: 400, error: { message } });
  }

  protected isRequestMatch(request: HttpRequest<any>, url: string, method?: string): boolean {
    method = method || 'GET';
    return request.url.endsWith(url) && request.method.toUpperCase() === method.toUpperCase();
  }

  private isNotMatch(requestUrl: string): boolean {
    for (const url of this.matchUrls()) {
      if (requestUrl.endsWith(url)) {
        return false;
      }
    }
    return true;
  }

  abstract matchUrls(): string[];

  abstract getFunctionByUrlAndMethod(request: HttpRequest<any>);
}
