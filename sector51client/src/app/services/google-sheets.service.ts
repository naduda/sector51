import { Injectable } from '@angular/core';

const gapiConfig = {
  apiKey: 'AIzaSyDSgxxXYkbmYHxuINDutoMknTYDab3Wpus',
  clientId: '416030521463-v5v16i1oohqpncf8kvr84aigf3oincrb.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
};

@Injectable()
export class GoogleSheetsService {
  private cb: any;
  private spreadsheetId: string;
  private sheetName: string;
  private range: string;
  private target: any;

  constructor() { }

  private initClient() {
    gapi.client.init(gapiConfig)
      .then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => this.updateSigninStatus(isSignedIn));
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
  }

  init(spreadsheetId: string, target: any) {
    this.spreadsheetId = spreadsheetId;
    this.target = target;
    gapi.load('client:auth2', () => this.initClient());
  }

  getValues(sheetName: string, range: string, callback: any) {
    this.sheetName = sheetName;
    this.range = range;
    this.cb = callback;
    gapi.auth2.getAuthInstance().signIn();
  }

  private updateSigninStatus(isSignedIn) {
    isSignedIn && this.setSheetValues();
  }

  private setSheetValues() {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.sheetName + '!' + this.range,
    }).then((response) => {
      const range = response.result;
      if (range.values.length > 0) {
        this.cb && this.cb(range.values, this.target);
        gapi.auth2.getAuthInstance().signOut();
      }
    }, (response) => {
      console.log(response);
      gapi.auth2.getAuthInstance().signOut();
    });
  }
}
