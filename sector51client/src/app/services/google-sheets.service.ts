import { Injectable } from '@angular/core';

const gapiConfig = {
  apiKey: 'AIzaSyDSgxxXYkbmYHxuINDutoMknTYDab3Wpus',
  clientId: '416030521463-v5v16i1oohqpncf8kvr84aigf3oincrb.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets'
};

@Injectable()
export class GoogleSheetsService {
  private spreadsheetId: string;
  private target: any;

  constructor() { }

  signIn = () => gapi.auth2.getAuthInstance().signIn();
  signOut = () => gapi.auth2.getAuthInstance().signOut();
  get isSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  init(spreadsheetId: string, target: any) {
    this.spreadsheetId = spreadsheetId;
    this.target = target;
    gapi.load('client:auth2', () => gapi.client.init(gapiConfig));
  }

  private appendSheetValues(sheetName: string, range: string, values: any[], cb: Function) {
    const body = { values: values };
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: sheetName + '!' + range,
      valueInputOption: 'RAW', // 'USER_ENTERED',
      resource: body
    }).then(() => {
      cb(true);
      this.signOut();
    }, () => {
      cb(false);
      this.signOut();
    });
  }

  writeSheetValues(sheetName: string, range: string, values: any[], cb: Function) {
    this.signIn().then((r) => {
      if (!this.isSignedIn) return;

      this.clearCells(sheetName, range)
        .then(() => this.appendSheetValues(sheetName, range, values, cb), () => this.signOut());
    });
  }

  private clearCells(sheetName: string, range: string) {
    return gapi.client.sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range: sheetName + '!' + range
    });
  }

  readSheetValues(sheetName: string, range: string, cb: Function) {
    this.signIn().then((r) => {
      if (!this.isSignedIn) return;

      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheetName + '!' + range,
      }).then((response) => {
        const range = response.result;
        if (range.values.length > 0) {
          cb(range.values, this.target);
          this.signOut();
        }
      }, () => {
        this.signOut();
      });
    });
  }
}
