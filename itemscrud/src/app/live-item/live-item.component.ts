import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../item-model';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-live-item',
  templateUrl: './live-item.component.html',
  styleUrls: ['./live-item.component.css']
})
export class LiveItemComponent implements OnInit {
  item: any = {};
  imageUrl: String = 'http://localhost:4000/';
  constructor(private route: ActivatedRoute,
    private router: Router,
    
    private itemservice: ItemService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemservice.getItem(params['id'])
      .subscribe(res => {
        this.item = res['items'];
      });
    })
  }

}
