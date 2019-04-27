import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../item-model';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sold-items',
  templateUrl: './sold-items.component.html',
  styleUrls: ['./sold-items.component.css']
})
export class SoldItemsComponent implements OnInit {

  constructor(private itemservice : ItemService) { }
  imageUrl: String = 'http://localhost:4000/';
  items : ItemModel[]; 
  adminFlag = true;
  orignalItems : ItemModel[];
  categories: any;
  ngOnInit() {
    this.itemservice.getSoldItems()
    .subscribe(res => {
      this.orignalItems = res['items'];
      this.items = res['items'];

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
