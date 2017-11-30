import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../services/modal.service';
import { ProductComponent } from '../pages/product/product.component';
import { CommonService } from 'app/services/common.service';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;
  private http: HttpClient;

  constructor(private modalService: ModalService, private common: CommonService) {}

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public initWebSocket(token: string, httpClient: HttpClient): void {
    const wsUrl = location.origin.replace('http://', 'ws://') + '/wsapi?token=' + token;
    this.http = httpClient;
    this.ws = new WebSocket(wsUrl.includes(':4200') ? wsUrl.replace(':4200', ':8089') : wsUrl);

    this.ws.onopen = () => {
        console.log('Server Connected.');
    };

    this.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      console.log(data);
      if (data.code && !location.href.includes('/#/registration')) {
        this.common.barcode = data.code;
        this.modalService.open(ProductComponent, null);
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.initWebSocket(token, this.http), 5000);
    };

    this.ws.onerror = (e) => {
      console.error(e);
    };
  }
}
