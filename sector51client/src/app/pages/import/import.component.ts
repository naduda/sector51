import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  read,
  utils,
  WorkBook,
  WorkSheet
  } from 'xlsx';
import {
  ERestResult,
  ERole,
  ESex,
  IResponse,
  ITableColumn
  } from '../../entities/common';
import { Profile } from '../../entities/profile';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'sector51-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit, AfterViewInit {
  height: string;
  columns: ITableColumn[];
  rowData: any[];
  private tableHeight: number;

  constructor(private http: HttpClient, private common: CommonService) {
  }

  ngOnInit() {
    this.columns = [];
    this.rowData = [];
  }

  ngAfterViewInit(): void {
    const div: any = document.getElementsByClassName('outlet col p-0')[0];
    const header: any = document.querySelector('sector51-import > div');
    this.tableHeight = div.offsetHeight - header.offsetHeight - 40;
  }

  removeAllUsers() {
    this.http.delete(REST_API.DELETE.removeAllUsers).subscribe((response: IResponse) => {
      if (response.result === ERestResult[ERestResult.OK]) {
        this.common.profile = undefined;
      }
    });
  }

  onFileChange(evt: any) {
    this.height = this.tableHeight + 'px';
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];
      const data: any[] = utils.sheet_to_json(ws, { header: 1 });

      const header: string[] = data[0];
      header.forEach(cell => this.columns.push({ field: cell.toLowerCase(), header: cell.toUpperCase() }));
      for (let i = 1; i < data.length; i++) {
        const element = data[i];
        const row = {};
        for (let j = 0; j < header.length; j++) {
          const cell = header[j];
          row[cell.toLowerCase()] = element[j];
        }
        this.rowData.push(row);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  import() {
    this.insertUsers(this.rowData, 0);
    this.common.profile = undefined;
  }

  private insertUsers(rowData, index: number) {
    if (rowData.length === index) {
      return;
    }
    const row = rowData[index];
    const role = row['roles'] || ERole[ERole.USER];
    const user: Profile = {
      authorities: role.toUpperCase(),
      balance: 0,
      role: role.toUpperCase(),
      email: row['email'] || '',
      birthday: row['birthday'] ? this.getDate(row['birthday']) : null,
      surname: row['surname'],
      name: row['name'],
      phone: row['phone'],
      sex: row['sex'].toUpperCase() === 'M' ? ESex.MAN : ESex.WOMAN,
      card: row['card'] || new Date().getTime()
    };
    if (row['password']) {
      user['password'] = '|' + row['password'];
    } else {
      user['password'] = user.card;
    }
    user['roles'] = user.authorities;
    this.http.post(REST_API.POST.user, user)
      .subscribe((response: IResponse) => {
        if (response.result === ERestResult[ERestResult.OK]) {
          this.insertServices(row, response.message['created'])
            .subscribe((response: IResponse) => {
              if (response.result === ERestResult[ERestResult.OK]) {
                row['success'] = true;
                this.insertUsers(rowData, ++index);
              }
            });
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
        if (response.result === ERestResult[ERestResult.OK]) {
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
    const pars = value.split('.');
    return new Date(+pars[2], +pars[1] - 1, +pars[0]);
  }
}
