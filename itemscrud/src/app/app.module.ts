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

const routes: Routes = [
  {
    path:'add',
    component:AddComponent
  },
  {
    path:'update/:id',
    component:UpdateComponent
  },
  {
    path:'view',
    component:ViewComponent
  },
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'live',
    component: LiveAuctionComponent
  },
  {
    path: 'sold',
    component: SoldItemsComponent
  },
  {
    path: 'liveItem/:id',
    component: LiveItemComponent
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
    LiveItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    SlimLoadingBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    DlDateTimeDateModule,  
    DlDateTimePickerModule
  ],
  providers: [ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
