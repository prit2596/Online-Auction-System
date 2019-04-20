import { Component, OnInit } from '@angular/core';
import {LiveService} from '../live.service';
import {ItemModel} from '../item-model';
@Component({
  selector: 'app-live-auction',
  templateUrl: './live-auction.component.html',
  styleUrls: ['./live-auction.component.css']
})
export class LiveAuctionComponent implements OnInit {

  constructor(private liveService : LiveService) { }
  imageUrl: String = 'http://localhost:4000/';
  items : ItemModel[]; 
  adminFlag = true;
  ngOnInit() {
    this.liveService.getLiveItems()
    .subscribe(res => {
      console.log(res.items)
      this.items = res.items;

    });
  }

}