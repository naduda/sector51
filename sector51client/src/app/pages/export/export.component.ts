import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ERole, ITableColumn, IUserService } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';

@Component({
  selector: 'sector51-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit, AfterViewInit {
  height: string;
  columns: ITableColumn[];
  rowData: any[];
  isLoaded: boolean;
  tableHeight: number;

  constructor(private http: HttpClient) {
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
  }

  export() {

  }

  loadData() {
    this.isLoaded = false;
    this.http.get<Profile[]>(REST_API.GET.users).subscribe(users => {
      users.sort((a: Profile, b: Profile) => {
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
      });
      users.forEach(user => {
        if (user['roles'] === ERole[ERole.OWNER]) return;
        const row: any = Object.assign({}, user);
        delete row.created;
        delete row.balance;
        this.http.get<any>(REST_API.GET.userServices(user['created'])).subscribe((services: IUserService[]) => {
          services.forEach(service => this.addService(row, service));

          row.sex = user.sex ? 'M' : 'W';
          row.birthday = this.timestamp2Date(user.birthday);
          this.rowData.push(row);
        });
      });
      this.isLoaded = true;
    });
  }

  private addService(row: any, service: IUserService) {
    const dtBeg = this.timestamp2Date(service.dtBeg);
    const dtEnd = this.timestamp2Date(service.dtEnd);
    switch (service.idService) {
      case 0:
      case 3:
      case 4:
        row.abontype = 'F';
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
