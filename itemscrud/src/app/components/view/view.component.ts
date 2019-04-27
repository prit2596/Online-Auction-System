import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../../item-model';
import { ItemService } from '../../item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})



export class ViewComponent implements OnInit {

  startTime: any;
  items: ItemModel[];
  imageUrl = 'http://localhost:4000/'
  adminFlag = false;
  orignalItems : ItemModel[];
  categories: any;
  constructor(private itemservice: ItemService,private router: Router) { }

  deleteItem(id) {
    this.itemservice.deleteItem(id).subscribe(res => {
      //.log('Deleted');
      this.router.navigateByUrl('');
    });
  }

  ngOnInit() {
    if(localStorage.getItem('admin') == 'true'){
      this.adminFlag = true;
    }
    this.items=[];
    this.items.length = 0;
  	this.itemservice.getItems()
    .subscribe((data) => 
    {
      this.orignalItems = data['items']
      this.items = data["items"]
     
      this.categories = new Set();
      this.items.forEach(item => {
        this.categories.add(item.category);
      })
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
