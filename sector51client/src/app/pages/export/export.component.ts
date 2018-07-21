import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../entities/common';
import { ExportService } from '../../services/export.service';
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

  constructor(private http: HttpClient, private googleService: GoogleSheetsService,
    private exportService: ExportService) {
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
    this.googleService.signIn().then((isSignedIn) => {
      if (!isSignedIn) return;
      this.exportService.export(this.googleService, (r) =>
        alert('Export' + (r ? '' : 'not') + ' success'), this.rowData);
    });
  }

  loadData() {
    this.isLoaded = false;
    this.exportService.loadData((data) => {
      this.rowData = data;
      this.isLoaded = true;
    });
  }
}
