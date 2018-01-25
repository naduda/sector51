import { Component, OnInit } from '@angular/core';
import { IModalWindow, ERestResult } from '../../../entities/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../../../entities/profile';
import { REST_API } from '../../../entities/rest-api';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'sector51-abonement',
  templateUrl: './abonement.component.html',
  styleUrls: ['./abonement.component.css']
})
export class AbonementComponent implements OnInit, IModalWindow {
  header: string;
  dtBeg: string;
  dtEnd: string;
  cash: number;
  private profile: Profile;

  constructor(public activeModal: NgbActiveModal,
    private http: HttpClient) {
    this.cash = 0;
  }

  ngOnInit() {
    const curDate = this.date2string(new Date());
    this.dtBeg = curDate;
    this.dtEnd = curDate;
  }

  private date2string(d: Date): string {
    let res = d.getFullYear() + '-';
    res += (d.getMonth() > 8 ? '' : '0') + (d.getMonth() + 1) + '-';
    res += d.getDate();
    return res;
  }

  btOkClick(instance: any) {
    const user = Object.assign({}, instance.profile);
    user.dtBeg = new Date(instance.dtBeg).getTime();
    user.dtEnd = new Date(instance.dtEnd).getTime();
    let result = false;
    instance.http.put(REST_API.PUT.user, user)
      .do(response => result = ERestResult[ERestResult.OK] === response.result)
      .flatMap(result => result ?
        instance.http.post(REST_API.POST.history, { idevent: 2, desc: user.created + '_' + instance.cash }) : of(null))
      .subscribe(response => {
        if (response && ERestResult[ERestResult.OK] === response.result) {
          console.log(response);
        } else {
          alert('Something wrong.');
          console.error(response);
        }
      });
  }

  btCancelClick(reason: any, instance: any) { }

  init(props: any): void {
    this.header = props.header;
    this.profile = props.profile;
  }
}
