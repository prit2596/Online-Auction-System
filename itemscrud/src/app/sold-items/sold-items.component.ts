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
  ngOnInit() {
    this.itemservice.getSoldItems()
    .subscribe(res => {
      this.items = res['items'];
    });
  }

}
