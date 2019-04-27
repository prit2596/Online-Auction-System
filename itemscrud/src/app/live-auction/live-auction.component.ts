import { Component, OnInit } from '@angular/core';
import {LiveService} from '../live.service';
import {ItemModel} from '../item-model';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-live-auction',
  templateUrl: './live-auction.component.html',
  styleUrls: ['./live-auction.component.css']
})
export class LiveAuctionComponent implements OnInit {

  constructor(private liveService : LiveService, private itemService: ItemService) { }
  imageUrl: String = 'http://localhost:4000/';
  items : ItemModel[]; 
  orignalItems : ItemModel[];
  categories: any;
  ngOnInit() {
    this.liveService.getLiveItems()
    .subscribe(res => {
      //.log(res.items)
      this.orignalItems = res.items;
      this.items = res.items;
      //.log(this.items.length)
      
      this.categories = new Set();
      this.items.forEach(item => {
        this.categories.add(item.category);
      })
      //.log(this.categories);
    });

    
  }

  sortByLowest(){
    this.items.sort(function(a, b){
      return a.bid_price.starting_bid - b.bid_price.starting_bid;
    })

  }
  sortByHighest(){
    this.items.sort(function(a, b){
      return b.bid_price.starting_bid - a.bid_price.starting_bid;
    })
  }

  filterByCategory(event){
    var selectedFilter = event.target.textContent;
    this.items = this.orignalItems;
    if(selectedFilter !== 'No Filter'){
      this.items = this.items.filter(item => {
        return item.category === selectedFilter;
      })
    }
    //.log(this.items);
  }
}
