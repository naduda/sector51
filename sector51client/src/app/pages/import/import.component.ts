import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, NgZone } from '@angular/core';
import { ITableColumn } from '../../entities/common';
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
  tableHeight: number;
  isSignIn: boolean;

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
    const div: any = document.getElementsByClassName('outlet col p-0')[0];
    const header: any = document.querySelector('sector51-import > div');
    this.tableHeight = div.offsetHeight - header.offsetHeight - 50;
  }

  private onGoogleAuth(values: string[][], that: ImportComponent) {
    that.columns = [];
    values[0].forEach(cell => that.columns.push({ field: cell.toLowerCase(), header: cell.toUpperCase() }));
    for (let i = 1; i < values.length; i++) {
      const element = values[i];
      if (!element[0]) continue;
      const row = {};
      for (let j = 0; j < that.columns.length; j++) {
        const cell = that.columns[j].field;
        if (cell === 'phone') {
          row[cell] = that.fixPhoneNumber(element[j]);
        } else {
          row[cell] = element[j];
        }
      }
      that.rowData.push(row);
    }
    that.isSignIn = true;
    that.zone.run(() => console.log(that.rowData.length + ' rows was loaded.'));
  }

  private fixPhoneNumber(text: string): string {
    text = text || '';
    if (text.length === 0) {
      return text;
    }

    text = text.replace(/\s/, '');
    text = text.replace(/\D/g, '');
    if (text.startsWith('3')) {
      text = '+' + text;
    } else if (text.startsWith('8')) {
      text = '+3' + text;
    } else if (text.startsWith('0')) {
      text = '+38' + text;
    }
    if (text.length === 13) {
      text = text.substring(0, 3) + ' (' + text.substring(3, 6) + ') ' +
        text.substring(6, 9) + '-' + text.substring(9, 11) + '-' + text.substring(11);
    }
    return text;
  }

  import() {
    this.http.post(REST_API.POST.userWithServices, this.rowData).subscribe((status: number[]) => {
      for (let i = 0; i < status.length; i++) {
        this.rowData[i].success = status[i] > 0;
      }
      this.common.profile = undefined;
    });
  }
}
