import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ERole, IUserService } from '../entities/common';
import { Profile } from '../entities/profile';
import { REST_API } from '../entities/rest-api';
import { GoogleSheetsService } from './google-sheets.service';

@Injectable()
export class ExportService {

  constructor(private http: HttpClient) { }

  export(googleService: GoogleSheetsService, success: Function, rowData?: any[]) {
    if (rowData === undefined) {
      this.loadData((rowData) => {
        const values = [];
        rowData.forEach(r => values.push(this.rowToArray(r)));
        googleService.writeSheetValues('Clients', 'A2:O', values, (isSuccess) => success(isSuccess));
      });
    } else {
      const values = [];
      rowData.forEach(r => values.push(this.rowToArray(r)));
      googleService.writeSheetValues('Clients', 'A2:O', values, (isSuccess) => success(isSuccess));
    }
  }

  private rowToArray(r): any[] {
    return [r.surname, r.name, r.phone, r.sex, r.card,
    r.abontype, r.dtbeg_a, r.dtend_a, r.box, r.dtbeg_b, r.dtend_b,
    r.birthday, r.roles, '', r.email];
  }

  loadData(callBack: Function) {
    let users: Profile[];
    const rowData = [];
    this.http.get<Profile[]>(REST_API.GET.users)
      .do(data => users = data)
      .flatMap(() => this.http.get<any[]>(REST_API.GET.allUserServices))
      .subscribe(services => {
        users.sort(this.sortUsers);
        users.forEach(user => {
          if (user['roles'] === ERole[ERole.OWNER]) return;
          const row: any = Object.assign({}, user);
          delete row.created;
          delete row.balance;
          const userServices = services.filter(s => s.idUser === user['created']);
          userServices.forEach(service => this.addService(row, service));

          row.sex = user.sex ? 'M' : 'W';
          row.birthday = this.timestamp2Date(user.birthday);
          rowData.push(row);
        });
        callBack(rowData);
      });
  }

  private sortUsers(a: Profile, b: Profile): number {
    if (a.surname < b.surname) {
      return -1;
    } else if (a.surname > b.surname) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }

  private addService(row: any, service: IUserService) {
    const dtBeg = this.timestamp2Date(service.dtBeg);
    const dtEnd = this.timestamp2Date(service.dtEnd);
    switch (service.idService) {
      case 0:
      case 5:
      case 8:
      case 11:
        row.abontype = 'F';
        row.dtbeg_a = dtBeg;
        row.dtend_a = dtEnd;
        break;
      case 3:
      case 6:
      case 9:
      case 12:
        row.abontype = 'M';
        row.dtbeg_a = dtBeg;
        row.dtend_a = dtEnd;
        break;
      case 4:
      case 7:
      case 10:
      case 13:
        row.abontype = 'E';
        row.dtbeg_a = dtBeg;
        row.dtend_a = dtEnd;
        break;
      case 1: break;
      case 2:
        row.box = service.value;
        row.dtbeg_b = dtBeg;
        row.dtend_b = dtEnd;
        break;
    }
  }

  private timestamp2Date(stamp) {
    if (+stamp === 0) return '';
    const date = new Date(stamp);
    let day: any = date.getDate();
    if (day < 10) day = '0' + day;
    let month: any = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    return day + '.' + month + '.' + date.getFullYear();
  }
}
