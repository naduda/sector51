import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EConfirmType, ERole, IProduct, RESERVED_PRODUCTS_ID } from '../entities/common';
import { REST_API } from '../entities/rest-api';
import { CommonService } from '../services/common.service';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;
  private http: HttpClient;
  private token: string;
  private isConnected: boolean;

  constructor(private common: CommonService) { }

  public disconnect() {
    this.token = undefined;
    this.common.profile = undefined;
    this.ws && this.ws.close();
  }

  public initWebSocket(token: string, httpClient: HttpClient): void {
    if (this.isConnected) return;

    this.token = token;
    const wsUrl = location.origin.replace('http://', 'ws://') + '/wsapi?token=' + token;
    this.http = httpClient;
    this.ws = new WebSocket(wsUrl.includes(':4200') ? wsUrl.replace(':4200', ':8089') : wsUrl);

    this.ws.onopen = () => {
      console.log('Server Connected.');
      this.isConnected = true;
    };

    this.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.user !== undefined && data.service !== undefined) {
        if (this.common.router.url === '/cart') {
          const virtualProduct: IProduct = {
            id: RESERVED_PRODUCTS_ID,
            name: data.user.name,
            desc: data.user.surname,
            price: data.user.balance,
            code: data.user.card,
            count: 1
          };
          const oldUser = this.common.cartProducts.find(p => p.id === virtualProduct.id);
          if (oldUser) {
            this.common.cartProducts.splice(this.common.cartProducts.indexOf(oldUser), 1);
          }
          this.common.cartProducts.push(virtualProduct);
        } else if (data.service === null) {
          this.common.confirm({
            type: EConfirmType.YES,
            message: 'Check you servicies',
            header: 'Warning',
            headerClass: 'bg-warning',
            icon: 'fa fa-bell text-warning',
          });
        } else {
          this.common.navigate('boxes', { code: data.user.card });
        }
      } else if (data.product !== undefined) {
        data.count = 1;
        this.common.confirm({
          type: EConfirmType.PRODUCT,
          data: data,
          header: data.product.name,
          acceptBtn: 'seld',
          rejectBtn: 'buy',
          accept: () => {
            data.product.count = data.count;
            this.common.cartProducts.push(data.product);
            this.common.navigate('cart');
          },
          reject: () => {
            data.product.count += data.count;
            this.http.put(REST_API.PUT.product, data.product).subscribe(() => { });
          }
        });
      } else if (data.barcode) {
        data.curType = { type: 'USER' };
        data.name = 'New product';
        data.selders = [];
        this.common.users.filter(u => u.authorities === ERole[ERole.SELDER] || u.authorities === ERole[ERole.OWNER]).forEach(u => {
          const selder: any = Object.assign({}, u);
          selder.fullName = u.surname + ' ' + u.name;
          data.selders.push(selder);
        });
        data.selder = Object.assign({}, this.common.profile);
        data.selder.fullName = data.selder.surname + ' ' + data.selder.name;
        if (data.selders.length === 0) {
          data.selders.push(data.selder);
        }
        data.price = 0;
        this.common.confirm({
          type: EConfirmType.BARCODE,
          data: data,
          width: 350,
          header: 'Unknown barcode',
          headerClass: 'bg-warning',
          accept: () => {
            if (data.curType.type === 'USER') {
              this.common.navigate('registration', { code: data.barcode });
            } else {
              const product: IProduct = {
                id: 0,
                name: data.name,
                code: data.barcode,
                count: 1,
                price: data.price * 100,
                desc: data.selder['created']
              };
              this.http.post(REST_API.POST.product, product, { params: { code: data.barcode } })
                .subscribe((response: IProduct) => {
                  this.common.newProduct.observers && this.common.newProduct.next(response);
                  this.common.navigate('products');
                });
            }
          }
        });
      }
    };

    this.ws.onclose = () => {
      console.log('Server Disconnected.');
      this.isConnected = false;
      this.common.profile && this.common.profile.role < ERole.USER && this.token &&
        setTimeout(() => this.initWebSocket(this.token, this.http), 5000);
    };

    this.ws.onerror = (e) => {
      console.error(e);
    };
  }
}
