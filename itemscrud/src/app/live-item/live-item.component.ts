import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../item-model';
import { ItemService } from '../item.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import {LivebidService} from '../livebid.service';

@Component({
  selector: 'app-live-item',
  templateUrl: './live-item.component.html',
  styleUrls: ['./live-item.component.css']
})
export class LiveItemComponent implements OnInit {
  
  userId: String = "pritthakkar2.pt@gmail.com";
  
  totalUsers = 0;
  item: any = {};
  imageUrl: String = 'http://localhost:4000/';
  constructor(private route: ActivatedRoute,
    private router: Router,
    private liveBidService : LivebidService,
    private itemservice: ItemService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemservice.getItem(params['id'])
      .subscribe(res => {
        this.item = res['items'];
      });

      this.liveBidService.joinAuction(params['id'], this.userId);
      this.liveBidService.totalUsers()
      .subscribe((data) => {
        console.log('here new users');
        this.totalUsers = data.numberOfUsers;
      });
    })
  }

}
