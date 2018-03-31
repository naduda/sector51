import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { CommonService } from '../../services/common.service';
import { BarcodeComponent } from './barcode.component';
import { of } from 'rxjs/observable/of';
import { FormsModule } from '@angular/forms';
import { RESERVED_PRODUCTS_ID, IProduct, IBarcode, ERestResult, ERole } from '../../entities/common';
import { REST_API } from '../../entities/rest-api';
import { FocusDirective } from '../../directives/focus.directive';
import { ElementTools } from '../../testing/commonTest';
import { Profile } from '../../entities/profile';
import { ModalService } from '../../services/modal.service';

describe('BarcodeComponent', () => {
  const products: IProduct[] = [
    { id: 0, name: 'NEW', desc: '-', count: 1, price: 0, code: '' },
    { id: RESERVED_PRODUCTS_ID, name: 'USER', desc: 'user', count: 1, price: 0, code: '0' },
    { id: 101, name: 'existProduct', desc: 'descProduct', count: 12, price: 1234, code: '1234567898765' }
  ];
  const users: Profile[] = [
    new Profile(null, 'Owner', 'Sowner', null, null, '1234567898760', null, null, true)
  ];
  let component: BarcodeComponent;
  let fixture: ComponentFixture<BarcodeComponent>;
  let et: ElementTools<BarcodeComponent>;
  let currentUrl: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeComponent, TranslatePipeStub, FocusDirective ],
      imports: [ FormsModule ],
      providers: [
        NgbActiveModal,
        { provide: ModalService, useValue: {
          open: () => {}
        }},
        { provide: HttpClient, useValue: {
          get: (url: string, params) => {
            if (url === REST_API.GET.products)
              return of(products.map(p => Object.assign({}, p)));
            else if (url.includes('/api/barcodeByCode/')) {
              const code = url.substring(url.lastIndexOf('/') + 1);
              const product = code !== 'undefined' ?
                products.find(p => p.code === code) : products.find(p => p.id === +params.params.productId);
              const barcode: IBarcode = {
                productId: product ? product.id : -1,
                code: product ? product.code : ''
              };
              return of(barcode);
            } else if (url.includes('/api/userByCard/')) {
              const code = url.substring(url.lastIndexOf('/') + 1);
              return of(Object.assign({}, users.find(u => u.card === code)));
            } else {
              return of(null);
            }
          },
          post: (url: string, product: IProduct) => {
            if (url === '/api/add/product') {
              product.id = products.length + 99;
              products.push(product);
            } else {
              console.log(url);
            }
            return of({ result: ERestResult[ERestResult.OK] });
          },
          put: (url: string, product: any) => {
            if (url === '/api/update/user') {
              const user = users.find(u => u.card === product.card);
              user.balance = product.balance;
            } else {
              // console.log(url);
            }
            return of({ result: ERestResult[ERestResult.OK] });
          }
        }},
        { provide: CommonService, useValue: {
          router: { },
          navigate: (url) => currentUrl = url,
          newProduct: {
            next: (product: IProduct) => of(product)
          },
          cartProducts: [],
          users: users
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeComponent);
    component = fixture.componentInstance;
    et = new ElementTools(fixture);
    currentUrl = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('product not exist (USER)', fakeAsync(() => {
    component.barcode = '1234567898764';
    fixture.detectChanges();
    expect(et.ne('.modal-header').getAttribute('class')).toMatch('bg-warning');
    expect(component.header).toEqual('unknownBarcode');
    et.click('div[ngbdropdownmenu] > div:last-child > label');
    expect(et.ne('.modal-body form:first-child button > span').innerHTML).toEqual('USER');
    expect(component.types.length).toBe(2);
    expect(et.ne('button[ngbDropdownToggle]').getAttribute('disabled')).toBeNull;
    expect(et.ne('button[ngbDropdownToggle] > span').innerHTML).toEqual('USER');
    expect(et.all('.modal-body form[hidden]').length).toBe(3);
    expect(et.all('.modal-body form:last-child > div[hidden]').length).toBe(1);
    expect(et.ne('button.btn-primary').innerHTML.trim().toLowerCase()).toEqual(TranslatePipeStub.translate('add'));
    component.btOkClick(component);
    expect(currentUrl).toEqual('registration');
  }));

  it('product not exist (NEW)', fakeAsync(() => {
    component.barcode = '1234567898764';
    fixture.detectChanges();
    expect(et.ne('.modal-header').getAttribute('class')).toMatch('bg-warning');
    et.click('div[ngbdropdownmenu] > div:first-child > label');
    expect(et.ne('.modal-body form:first-child button > span').innerHTML).toEqual('NEW');
    expect(et.all('.modal-body form[hidden]').length).toBe(0);
    expect(et.all('.modal-body form:last-child > div[hidden]').length).toBe(1);
    expect(et.ne('button.btn-primary').innerHTML.trim().toLowerCase()).toEqual(TranslatePipeStub.translate('add'));
    et.setInputValue('input[name="name"]', 'existProduct');
    et.setInputValue('input[name="desc"]', 'existProductDesc');
    et.setInputValue('input[name="count"]', '12');
    et.setInputValue('input[name="price"]', '12.34');
    component.btOkClick(component);
    expect(products.length).toBe(4);
  }));

  it('product exist', () => {
    component.barcode = '1234567898765';
    fixture.detectChanges();
    expect(et.ne('button[ngbDropdownToggle][disabled]')).toBeDefined();
    expect(et.ne('button[ngbDropdownToggle] > span').innerHTML.toLowerCase()).toEqual('existproduct');
    expect(et.ne('.modal-header').getAttribute('class')).toMatch('bg-info');
    expect(et.ne('.modal-header > h4').innerHTML.toLowerCase()).toEqual('existproduct descproduct');
    expect(et.all('.modal-body form[hidden]').length).toBe(3);
    expect(et.all('.modal-body form:last-child > div[hidden]').length).toBe(0);
    expect(et.ne('input[name="count"]').getAttribute('ng-reflect-is-disabled')).toBeTruthy;
    expect(et.ne('input[name="count"]').getAttribute('ng-reflect-model')).toBe('12');
    expect(et.ne('input[name="price"]').getAttribute('ng-reflect-is-disabled')).toBeTruthy;
    expect(et.ne('input[name="price"]').getAttribute('ng-reflect-model')).toBe('12.34');
    expect(et.ne('button.btn-primary').innerHTML.trim().toLowerCase()).toEqual(TranslatePipeStub.translate('apply'));
    component.btOkClick(component);
  });

  // it('change user balance', fakeAsync(() => {
  //   component.barcode = '1234567898760';
  //   fixture.detectChanges();
  //   expect(et.ne('button[ngbDropdownToggle][disabled]')).toBeDefined();
  //   expect(et.ne('button[ngbDropdownToggle] > span').innerHTML.toLowerCase()).toEqual('owner');
  //   expect(et.ne('.modal-header').getAttribute('class')).toMatch('bg-info');
  //   expect(et.ne('.modal-header > h4').innerHTML.toLowerCase()).toEqual('owner sowner');
  //   expect(et.all('.modal-body form[hidden]').length).toBe(4);
  //   expect(et.all('.modal-body form:last-child > div[hidden]').length).toBe(0);
  //   expect(et.ne('input[name="curCount"]').getAttribute('ng-reflect-model')).toBe('0');
  //   et.setInputValue('input[name="curCount"]', '50.32');
  //   expect(et.ne('button.btn-primary').innerHTML.trim().toLowerCase()).toEqual(TranslatePipeStub.translate('apply'));
  //   component.btOkClick(component);
  //   expect(users.find(u => u.card === component.barcode).balance).toBe(5032);
  // }));

  it('product edit', fakeAsync(() => {
    component.product = products[2];
    component.isEdit = component.product !== undefined;
    fixture.detectChanges();
    expect(et.ne('.modal-body form:first-child').getAttribute('hidden')).toBeDefined();
    expect(et.ne('.modal-body form:last-child').getAttribute('hidden')).toBeDefined();
    expect(et.ne('input[name="name"]').getAttribute('ng-reflect-is-disabled')).toBeFalsy;
    expect(et.ne('input[name="desc"]').getAttribute('ng-reflect-is-disabled')).toBeFalsy;
    expect(et.ne('input[name="count"]').getAttribute('ng-reflect-is-disabled')).toBeTruthy;
    expect(et.ne('input[name="price"]').getAttribute('ng-reflect-is-disabled')).toBeFalsy;
    expect(et.ne('button.btn-primary').innerHTML.trim().toLowerCase()).toEqual(TranslatePipeStub.translate('update'));
    et.setInputValue('input[name="name"]', 'test');
    et.setInputValue('input[name="desc"]', 'desc');
    et.setInputValue('input[name="price"]', '43.21');
    const id = component.product.id;
    component.btOkClick(component);
    fixture.detectChanges();
    const updated = products.find(p => p.id === id);
    expect(updated.name).toEqual('test');
    expect(updated.desc).toEqual('desc');
    expect(updated.price).toEqual(4321);
  }));
});