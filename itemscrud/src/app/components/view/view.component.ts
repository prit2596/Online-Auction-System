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

  items: ItemModel[];
  imageUrl = 'http://localhost:4000/'
  adminFlag = true;
  constructor(private itemservice: ItemService,private router: Router) { }

  deleteItem(id) {
    this.itemservice.deleteItem(id).subscribe(res => {
      console.log('Deleted');
      this.router.navigateByUrl('/view');
    });
  }

  ngOnInit() {
    this.items=[];
    this.items.length = 0;
  	this.itemservice.getItems()
  	.subscribe((data) => 
  	{this.items = data["items"]
  	console.log("here" + JSON.stringify(data));
  	});
  }
}
