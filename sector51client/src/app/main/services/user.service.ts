import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { Rest } from '../constants/rest';
import { IUser } from '../model/interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  get roles(): Observable<SelectItem[]> {
    return this.http.get<SelectItem[]>(Rest.GET.roles);
  }

  createUser(user: IUser): Observable<object> {
    return this.http.post<IUser>(Rest.POST.user, user);
  }
}
