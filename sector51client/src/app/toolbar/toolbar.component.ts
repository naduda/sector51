import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from '../services/authentication.service';
import { LangService } from "prNgCommon/lang/lang.service";
import { CommonService } from '../services/common.service';
import { WebsocketService } from '../services/websocket.service';
import { Profile } from '../entities/profile';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'sector51-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  public user: Profile;
  private subscription: Subscription;

  constructor(public auth: AuthenticationService,
              public lang: LangService,
              public common: CommonService,
              private http: HttpClient,
              private websocket: WebsocketService) {
    this.subscription = common.user.subscribe(u => this.user = u);
  }

  ngOnInit() {
    if (this.auth.username.length == 0) {
      return;
    }
    this.http.get<Profile>('api/profile/' + this.auth.username)
      .subscribe(
        profile => {
          this.common.currentUser = profile;
          this.common.user.next(profile); 
          this.websocket.initWebSocket(this.auth.token);
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
