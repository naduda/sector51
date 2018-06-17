import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService, private messageService: MessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const putOrDelete = req.method === 'PUT' || req.method === 'DELETE';
    const headers = new HttpHeaders({ 'X-Auth-Token': this.auth.token });
    const responseType: 'json' | 'text' = putOrDelete ? 'text' : 'json';
    const clone = req.clone({ headers: headers, responseType: responseType });
    console.time(`Request for ${req.urlWithParams} took`);
    return next.handle(clone)
      .do(event => {
        if (event instanceof HttpResponse) {
          console.timeEnd(`Request for ${req.urlWithParams} took`);
          if (putOrDelete) {
            this.messageService.add({ severity: 'info', summary: 'Information', detail: event.body });
            console.log(`Result: ${event.body}`);
          }
        }
      })
      .catch(ex => {
        this.messageService.add({ severity: 'info', summary: 'Error', detail: ex });
        if ((ex instanceof HttpErrorResponse) && ex.status === 403) {
          this.auth.logout();
        }
        return Observable.throw(ex);
      });
  }
}
