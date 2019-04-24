import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ItemModel } from '../item-model';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import {LivebidService} from '../livebid.service';
import { CountdownTimerModule } from 'ngx-countdown-timer';

@Component({
  selector: 'app-live-item',
  templateUrl: './live-item.component.html',
  styleUrls: ['./live-item.component.css']
})
export class LiveItemComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  userId: String;
  end_time : any;
  stop = false;
  totalUsers = 0;
  item: any = {};
  sold = false;
  winner: any = {};
  imageUrl: String = 'http://localhost:4000/';
  logs = [];



  constructor(private route: ActivatedRoute,
    private router: Router,
    private liveBidService : LivebidService,
    private itemservice: ItemService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId')
    this.scrollToBottom();
    this.route.params.subscribe(params => {
      this.itemservice.getItem(params['id'])
      .subscribe(res => {
        this.item = res['items'];
        console.log(this.item)
        this.end_time = new Date(this.item.time.end_time);
      });

      this.liveBidService.joinAuction(params['id'], this.userId);
      this.liveBidService.totalUsers()
      .subscribe((data) => {
        console.log('here new users');
        this.totalUsers = data.numberOfUsers;
      });

      this.liveBidService.fetchBidLogs(params['id']);
      this.liveBidService.firstTimeLogs()
      .subscribe((data) => {
        this.logs = data.users
      })

      this.liveBidService.postedBid()
      .subscribe((data) => {
        console.log('new posted bid');
        this.logs.push(data.user)
      })

      this.liveBidService.winner()
      .subscribe((data) => {
        this.winner = data;
        this.sold = true;
      })
    })
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }


  addBid(event){
    var bid = event.target.value;
    console.log(bid);
    this.liveBidService.addBid(this.item._id, this.userId, bid);
  }

  timeOut(){
    if(!this.stop){
      console.log('timeout in Component');
      this.liveBidService.timeOut(this.item._id);  
      this.stop = true;
    }
  }
  ngOnDestroy(){
    console.log('onDestroy')
    //this.liveBidService.leaveAuction();
  }

}