import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ERestResult, ERole, ESex, IResponse, ITableColumn } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';
import { GoogleSheetsService } from '../../services/google-sheets.service';

@Component({
  selector: 'sector51-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements AfterViewInit {
  columns: ITableColumn[];
  rowData: any[];

  constructor(private http: HttpClient, private common: CommonService,
    private googleService: GoogleSheetsService, private zone: NgZone) {
    this.rowData = [];
    this.columns = [];
  }

  getGoogleValues() {
    this.googleService.getValues('Clients', 'A:O', this.onGoogleAuth);
  }

  ngAfterViewInit(): void {
    this.googleService.init('1wl0E300r15yTHyw5uHM1sfrHLCWq1h2c5armNcel7l4', this);
  }

  private onGoogleAuth(values: string[][]) {
    const that = this['target'];
    that.columns = [];
    values[0].forEach(cell => that.columns.push({ field: cell.toLowerCase(), header: cell.toUpperCase() }));
    for (let i = 1; i < values.length; i++) {
      const element = values[i];
      if (!element[0]) continue;
      const row = {};
      for (let j = 0; j < that.columns.length; j++) {
        const cell = that.columns[j].field;
        row[cell] = element[j];
      }
      that.rowData.push(row);
    }
    that.zone.run(() => console.log(that.rowData.length + ' rows was loaded.'));
  }

  import() {
    this.http.post(REST_API.POST.userWithServices, this.rowData).subscribe((response: IResponse) => {
      const status: number[] = response.message;
      for (let i = 0; i < status.length; i++) {
        this.rowData[i].success = status[i] > 0;
      }
      this.common.profile = undefined;
    });
  }

  private insertUsers(rowData, index: number) {
    if (rowData.length === index) {
      return;
    }
    const row = rowData[index];
    const role = row['user_type'] || ERole[ERole.USER];
    const user: Profile = {
      authorities: role.toUpperCase(),
      balance: 0,
      role: role.toUpperCase(),
      email: row['email'] || '',
      birthday: this.getDate(row['birthday']),
      surname: row['surname'],
      name: row['name'],
      phone: row['phone'].toString().replace(/\s/g, ''),
      sex: row['sex'].toUpperCase() === 'M' ? ESex.MAN : ESex.WOMAN,
      card: row['card'] || new Date().getTime()
    };
    if (row['password']) {
      user['password'] = '|' + row['password'];
    } else {
      user['password'] = user.card;
    }
    user['roles'] = user.authorities;
    this.http.post(REST_API.POST.user, user).subscribe((response: IResponse) => {
      if (response.result === ERestResult[ERestResult.OK]) {
        this.insertServices(row, response.message['created']).subscribe((response: IResponse) => {
          if (response.result === ERestResult[ERestResult.OK]) {
            row['success'] = true;
            this.insertUsers(rowData, ++index);
          }
        });
      } else {
        console.timeEnd('import');
      }
    });
  }

  private insertServices(row: any, userId: number): Observable<any> {
    if (!row['dtbeg_a']) return of({ result: ERestResult[ERestResult.OK], message: '' });
    const abontype = row['abontype'] ? row['abontype'].trim().toUpperCase() : '';
    const userServise = {
      idService: abontype === 'M' ? 3 : abontype === 'E' ? 4 : 0,
      idUser: userId,
      dtBeg: this.getDate(row['dtbeg_a']),
      dtEnd: this.getDate(row['dtend_a']),
      desc: '0'
    };
    return this.http.post(REST_API.POST.userService, userServise)
      .flatMap((response: IResponse) => {
        if (response.result === ERestResult[ERestResult.OK] && row['box']) {
          userServise.idService = 2;
          userServise.dtBeg = this.getDate(row['dtbeg_b']);
          userServise.dtEnd = this.getDate(row['dtend_b']);
          userServise['value'] = +row['box'];
          return this.http.post(REST_API.POST.userService, userServise);
        } else {
          return of(response);
        }
      });
  }

  private getDate(value: string): Date {
    if (!value) return null;
    const pars = value.split('.');
    return new Date(+pars[2], +pars[1] - 1, +pars[0]);
  }
}
