import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewComponent } from './components/view/view.component';
import { AddComponent } from './components/add/add.component';
import { UpdateComponent } from './components/update/update.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { Component } from '@angular/core';
import { NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {ItemService} from './item.service';
import {ReactiveFormsModule} from '@angular/forms';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LiveAuctionComponent } from './live-auction/live-auction.component';
import { SoldItemsComponent } from './sold-items/sold-items.component';
import { LiveItemComponent } from './live-item/live-item.component';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { SignupComponent } from './signup/signup.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard-service.service';
import { JwtModule } from '@auth0/angular-jwt';
import {NgxPaginationModule} from 'ngx-pagination';
const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'editProfile',
    component: EditUserComponent,
    canActivate: [AuthGuardService]
  },
  {
    path:'add',
    component:AddComponent,
    canActivate: [AuthGuardService]
  },
  {
    path:'update/:id',
    component:UpdateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path:'view',
    component:ViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'live',
    component: LiveAuctionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sold',
    component: SoldItemsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'liveItem/:id',
    component: LiveItemComponent,
    canActivate: [AuthGuardService]
  }
];
@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    AddComponent,
    UpdateComponent,
    DashboardComponent,
    LiveAuctionComponent,
    SoldItemsComponent,
    LiveItemComponent,
    SignupComponent,
    EditUserComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    SlimLoadingBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    DlDateTimeDateModule,  
    DlDateTimePickerModule,
    NgxPaginationModule,
    CountdownTimerModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return     localStorage.getItem('access_token');},
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['http://localhost:4000/api/user/login']
      }
    })
  ],
  providers: [ItemService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
