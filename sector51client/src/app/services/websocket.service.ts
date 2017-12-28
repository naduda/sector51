import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../services/modal.service';
import { BarcodeComponent } from '../pages/barcode/barcode.component';
import { CommonService } from '../services/common.service';
import { ERole } from '../entities/common';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;
  private http: HttpClient;
  private token: string;

  constructor(private modalService: ModalService, private common: CommonService) {}

  public disconnect() {
    this.token = undefined;
    this.common.profile = undefined;
    this.ws && this.ws.close();
  }

  public initWebSocket(token: string, httpClient: HttpClient): void {
    this.token = token;
    const wsUrl = location.origin.replace('http://', 'ws://') + '/wsapi?token=' + token;
    this.http = httpClient;
    this.ws = new WebSocket(wsUrl.includes(':4200') ? wsUrl.replace(':4200', ':8089') : wsUrl);

    this.ws.onopen = () => {
        console.log('Server Connected.');
    };

    this.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.code && !location.href.includes('/#/registration')) {
        this.modalService.open(BarcodeComponent, { code: data.code });
      }
    };

    this.ws.onclose = () => {
      console.log('Server Disconnected.');
      this.common.profile && this.common.profile.role < ERole.USER && this.token &&
        setTimeout(() => this.initWebSocket(this.token, this.http), 5000);
    };

    this.ws.onerror = (e) => {
      console.error(e);
    };
  }
}
