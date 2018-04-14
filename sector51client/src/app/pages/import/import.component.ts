import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WorkBook, read, WorkSheet, utils } from 'xlsx';
import { ITableColumn, IResponse, ERole, ESex } from '../../entities/common';
import { HttpClient } from '@angular/common/http';
import { REST_API } from '../../entities/rest-api';
import { Profile } from '../../entities/profile';

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
    const el = this.rowData[0];
    const user: Profile = {
      authorities: ERole[ERole.USER],
      balance: 0,
      role: ERole.USER,
      email: el['email'] || '',
      birthday: el['birthday'] || '',
      surname: el['surname'],
      name: el['name'],
      phone: el['phone'],
      sex: el['sex'] === 'M' ? ESex.MAN : ESex.WOMAN,
      card: el['card']
    };
    user['password'] = user.card;
    user['roles'] = user.authorities;
    this.http.post(REST_API.POST.user, user)
      .subscribe((response: IResponse) => console.log(response))
  }
}
