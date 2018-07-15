import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ERole, ITableColumn, IUserService } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';
import { GoogleSheetsService } from '../../services/google-sheets.service';

@Component({
  selector: 'sector51-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css'],
  providers: [GoogleSheetsService]
})
export class ExportComponent implements OnInit, AfterViewInit {
  height: string;
  columns: ITableColumn[];
  rowData: any[];
  isLoaded: boolean;
  tableHeight: number;

  constructor(private http: HttpClient, private googleService: GoogleSheetsService) {
  }

  ngOnInit() {
    this.columns = [
      { field: 'surname', header: 'SURNAME', width: 100 },
      { field: 'name', header: 'NAME', width: 100 },
      { field: 'phone', header: 'PHONE', width: 100 },
      { field: 'sex', header: 'SEX', width: 50 },
      { field: 'card', header: 'CARD', width: 100 },
      { field: 'abontype', header: 'ABONTYPE', width: 100 },
      { field: 'dtbeg_a', header: 'DTBEG_A', width: 100 },
      { field: 'dtend_a', header: 'DTEND_A', width: 100 },
      { field: 'box', header: 'BOX', width: 100 },
      { field: 'dtbeg_b', header: 'DTBEG_B', width: 100 },
      { field: 'dtend_b', header: 'DTEND_B', width: 100 },
      { field: 'birthday', header: 'BIRTHDAY', width: 100 },
      { field: 'roles', header: 'ROLES', width: 100 },
      { field: 'email', header: 'EMAIL', width: 100 },
      { field: 'password', header: 'PASSWORD', width: 500 }
    ];
    this.rowData = [];
  }

  ngAfterViewInit(): void {
    const div: any = document.getElementsByClassName('outlet col p-0')[0];
    const header: any = document.querySelector('sector51-export > div');
    this.tableHeight = div.offsetHeight - header.offsetHeight - 50;
    this.googleService.init('1wl0E300r15yTHyw5uHM1sfrHLCWq1h2c5armNcel7l4', this);
  }

  export() {
    const values = [];
    this.rowData.forEach(r => values.push(this.rowToArray(r)));
    this.googleService.writeSheetValues('Clients', 'A2:O', values, (isSuccess) => console.log(isSuccess));
  }

  loadData() {
    this.isLoaded = false;
    let users: Profile[];
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
          this.rowData.push(row);
        });
        this.isLoaded = true;
      });
  }

  private rowToArray(r): any[] {
    return [r.surname, r.name, r.phone, r.sex, r.card,
    r.abontype, r.dtbeg_a, r.dtend_a, r.box, r.dtbeg_b, r.dtend_b,
    r.birthday, r.roles, '', r.email];
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
