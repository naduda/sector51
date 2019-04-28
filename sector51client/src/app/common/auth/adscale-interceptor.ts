import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HEADERS } from '../constants/http-headers';

@Injectable({
  providedIn: 'root'
})
export class AdscaleInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = this.appendRequestHeaders(req.headers);
    const clone = req.clone({ responseType: 'json', url: req.url, headers: headers });

    console.time(`Request for ${req.urlWithParams} took`);
    return next.handle(clone).pipe(
      tap(event => {
        if (!isDevMode()) {
          return;
        }
        if (event instanceof HttpResponse) {
          console.timeEnd(`Request for ${req.urlWithParams} took`);
          if (req.method !== 'GET' && event.body) {
            let responseText = event.body;
            if (typeof event.body === 'object') {
              responseText = JSON.stringify(responseText);
            }
            console.log(`Result: ${responseText}`);
          }
        }
      }),
      catchError(ex => {
        if ((ex instanceof HttpErrorResponse) && ex.status === 403) {
          console.log('403 status error.');
        }
        return throwError(ex);
      })
    );
  }

  private appendRequestHeaders(value: HttpHeaders): HttpHeaders {
    let headers = HEADERS.jsonUTF8;
    if (value.keys().includes('Content-Type')) {
      headers = headers.delete('Content-Type');
    }
    for (const key of value.keys()) {
      headers = headers.append(key, value.get(key));
    }
    return headers;
  }
}
