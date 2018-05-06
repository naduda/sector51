import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EConfirmType, ERole } from '../entities/common';
import { CommonService } from '../services/common.service';
import { ModalService } from '../services/modal.service';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;
  private http: HttpClient;
  private token: string;

  constructor(private modalService: ModalService, private common: CommonService) { }

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
        // this.modalService.open(BarcodeComponent, { code: data.code });
        this.common.confirm({
          type: EConfirmType.YES,
          data: { message: 'Check you servicies' },
          header: 'Warning',
          icon: 'fa fa-bell',
          rejectVisible: false,
          accept: () => { }
        });
      } else if (data.code && location.href.includes('/#/registration')) {
        // const input: any = document.querySelector('input[name="card"]');
        // input.value = data.code;
        // alert('Card was changed.');
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
