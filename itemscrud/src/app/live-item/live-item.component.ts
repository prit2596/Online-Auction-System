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
  totalUsers = 1;
  item: any = {};
  sold: any;
  winner: any = {};
  imageUrl: String = 'http://localhost:4000/';
  logs = [];
  highestBid = 0;
  private liveBidService;
  categories: [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    //private liveBidService : LivebidService,
    private itemservice: ItemService) { }

  ngOnInit() {
    this.liveBidService = new LivebidService();
    this.sold = false;
    this.userId = localStorage.getItem('userId')
    this.scrollToBottom();
    this.route.params.subscribe(params => {
      this.itemservice.getItem(params['id'])
      .subscribe(res => {
        this.item = res['items'];
        //.log(this.item)
        this.end_time = new Date(this.item.time.end_time);
      });

      this.liveBidService.joinAuction(params['id'], this.userId);
      this.liveBidService.totalUsers()
      .subscribe((data) => {
        //.log('here new users');
        this.totalUsers = data.numberOfUsers;
      });

      this.liveBidService.fetchBidLogs(params['id']);
      this.liveBidService.firstTimeLogs()
      .subscribe((data) => {
        this.logs = data.users;
        this.highestBid = this.logs[this.logs.length - 1].bid;
      })

      this.liveBidService.postedBid()
      .subscribe((data) => {
        //.log('new posted bid');
        this.logs.push(data.user)
        this.highestBid = data.user.bid;
      })

      this.liveBidService.winner()
      .subscribe((data) => {
        //.log("winner");
        this.winner = data;
        this.sold = true;
        //.log(this.sold);
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
    //.log(bid);
    this.liveBidService.addBid(this.item._id, this.userId, bid);
  }

  timeOut(){
    if(!this.stop){
      //.log('timeout in Component');
      this.liveBidService.timeOut(this.item._id);  
      this.stop = true;
    }
  }
  ngOnDestroy(){
    //.log('onDestroy')
    this.liveBidService.ngOnDestroy();
    //this.liveBidService.leaveAuction();
  }

}