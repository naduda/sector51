import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../services/common.service';
import { Profile } from '../entities/profile';
import { ModalComponent } from '../pages/modal/modal.component';
import { ModalService } from '../services/modal.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'sector51-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  public selectedUserId: number;
  public user: Profile;
  public users: Profile[];
  public showAll: boolean;
  private subscription: Subscription;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
              private modalService: ModalService, common: CommonService) {
    this.subscription = common.user.subscribe(u => this.user = u);
  }

  ngOnInit() {
    this.route.queryParams
    .do(params => {
      this.showAll = params['all'] === 'true';
      this.selectedUserId = params['user'] ? +params['user'] : -1;
    })
    .flatMap(params => this.users ? Observable.of(this.users) : this.http.get<Profile[]>('/api/getUsers'))
    .do(users => this.users = users)
    .subscribe(users => this.user = users.find(u => u['created'] === this.selectedUserId));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeQueryParam(name: string, value: any) {
    this.route.queryParams.subscribe(params => {
      const newparams = {};
      Object.keys(params).forEach(key => newparams[key] = params[key]);
      newparams[name] = value;
      this.router.navigate(['/main'], { queryParams: newparams });
    }).unsubscribe();
  }

  removeUser(idUser) {
    const props = {
      header: 'attention' + '!',
      headerClass: 'alert alert-danger',
      body: 'promptRemoveUserQuestion',
      btOK: 'apply',
      btCancel: 'cancel'
    };
    this.modalService.open(props, (result) =>
      this.http.delete('/api/removeUser/' + idUser)
        .subscribe((response: any) => {
          if (response.result === 'OK') {
            this.users.splice(this.users.indexOf(this.user), 1);
            this.user = undefined;
          }
        })
    );
  }
}
