import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../service/user-service.service';
import { ItemService } from '../item.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserServiceService, private itemService: ItemService) { }
  user: any;
  itemsBought = new Array();
  imageUrl: String = 'http://localhost:4000/';
  ngOnInit() {

    this.userService.getUserById(localStorage.getItem('userId'))
    .subscribe((data) => {
      this.user = data.user;
      this.user.items_bought.forEach(it => {
        this.itemService.getItem(it.item)
        .subscribe(res => {
          this.itemsBought.push(res.items)
        })
        console.log(this.itemsBought);
        console.log(this.user)
      })
    })
  }

}
