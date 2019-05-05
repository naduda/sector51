import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Rest } from '../constants/Rest';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  translationSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  translation(code: string): Observable<object> {
    return this.http.get<any>(Rest.GET.translation(code))
      .pipe(
        tap(response => this.translationSubject.next(response))
      );
  }
}
