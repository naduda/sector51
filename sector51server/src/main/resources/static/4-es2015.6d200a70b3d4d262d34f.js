(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{o1NI:function(n,l,t){"use strict";t.r(l);var u=t("8Y7J");class e{}var o=t("pMnS"),r=t("tuOx");class a{constructor(n){this.authService=n}ngOnInit(){}logout(){this.authService.logout()}}var c=u["\u0275crt"]({encapsulation:0,styles:[[""]],data:{}});function i(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"h3",[["class","text-success"]],null,null,null,null,null)),(n()(),u["\u0275ted"](-1,null,["user-list works!"])),(n()(),u["\u0275eld"](2,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),u["\u0275eld"](3,0,null,null,0,"hr",[],null,null,null,null,null)),(n()(),u["\u0275eld"](4,0,null,null,1,"button",[["class","btn btn-primary px-5"]],null,[[null,"click"]],function(n,l,t){var u=!0;return"click"===l&&(u=!1!==n.component.logout()&&u),u},null,null)),(n()(),u["\u0275ted"](-1,null,["Logout"]))],null,null)}function d(n){return u["\u0275vid"](0,[(n()(),u["\u0275eld"](0,0,null,null,1,"sector-user-list",[],null,null,null,i,c)),u["\u0275did"](1,114688,null,0,a,[r.a],null,null)],function(n,l){n(l,1,0)},null)}var s=u["\u0275ccf"]("sector-user-list",a,d,{},{},[]),m=t("SVse"),p=t("IheW"),v=t("ixYM"),f=t("jbSl"),g=t("cLBK"),h=t("q08S"),k=t("iInd");class b{constructor(n,l){this.router=n,this.authenticationService=l}canActivate(n,l){return!!this.authenticationService.currentUserValue||(this.router.navigate(["login"],{queryParams:{returnUrl:l.url}}),!1)}}b.ngInjectableDef=u["\u0275\u0275defineInjectable"]({factory:function(){return new b(u["\u0275\u0275inject"](k.k),u["\u0275\u0275inject"](r.a))},token:b,providedIn:"root"});class w{}var I=t("a6Df");t.d(l,"MainModuleNgFactory",function(){return S});var S=u["\u0275cmf"](e,[],function(n){return u["\u0275mod"]([u["\u0275mpd"](512,u.ComponentFactoryResolver,u["\u0275CodegenComponentFactoryResolver"],[[8,[o.a,s]],[3,u.ComponentFactoryResolver],u.NgModuleRef]),u["\u0275mpd"](4608,m.NgLocalization,m.NgLocaleLocalization,[u.LOCALE_ID,[2,m["\u0275angular_packages_common_common_a"]]]),u["\u0275mpd"](4608,p.h,p.n,[m.DOCUMENT,u.PLATFORM_ID,p.l]),u["\u0275mpd"](4608,p.o,p.o,[p.h,p.m]),u["\u0275mpd"](5120,p.a,function(n,l,t){return[n,new v.a(l),new f.a(t)]},[p.o,r.a,r.a]),u["\u0275mpd"](4608,p.k,p.k,[]),u["\u0275mpd"](6144,p.i,null,[p.k]),u["\u0275mpd"](4608,p.g,p.g,[p.i]),u["\u0275mpd"](6144,p.b,null,[p.g]),u["\u0275mpd"](4608,p.f,p.j,[p.b,u.Injector]),u["\u0275mpd"](4608,p.c,p.c,[p.f]),u["\u0275mpd"](4608,g.a,g.a,[]),u["\u0275mpd"](4608,h.a,h.a,[p.c]),u["\u0275mpd"](1073742336,m.CommonModule,m.CommonModule,[]),u["\u0275mpd"](1073742336,k.m,k.m,[[2,k.r],[2,k.k]]),u["\u0275mpd"](1073742336,w,w,[]),u["\u0275mpd"](1073742336,p.e,p.e,[]),u["\u0275mpd"](1073742336,p.d,p.d,[]),u["\u0275mpd"](1073742336,I.a,I.a,[]),u["\u0275mpd"](1073742336,e,e,[]),u["\u0275mpd"](1024,k.i,function(){return[[{path:"",redirectTo:"list"},{path:"",component:a,canActivate:[b]}]]},[]),u["\u0275mpd"](256,p.l,"XSRF-TOKEN",[]),u["\u0275mpd"](256,p.m,"X-XSRF-TOKEN",[])])})}}]);