import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WorkBook, read, WorkSheet, utils } from 'xlsx';
import { ITableColumn, IResponse, ERole, ESex, ERestResult } from '../../entities/common';
import { HttpClient } from '@angular/common/http';
import { REST_API } from '../../entities/rest-api';
import { Profile } from '../../entities/profile';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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

  constructor(private http: HttpClient) {
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
  }

  private insertUsers(rowData, index: number) {
    if (rowData.length === index) {
      return;
    }
    const row = rowData[index];
    const user: Profile = {
      authorities: ERole[ERole.USER],
      balance: 0,
      role: ERole.USER,
      email: row['email'] || '',
      birthday: row['birthday'] || '',
      surname: row['surname'],
      name: row['name'],
      phone: row['phone'],
      sex: row['sex'] === 'M' ? ESex.MAN : ESex.WOMAN,
      card: row['card']
    };
    user['password'] = user.card;
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
    const abontype = row['abontype'].trim().toUpperCase();
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
