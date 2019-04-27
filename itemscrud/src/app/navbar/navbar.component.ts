import { Component, OnInit } from '@angular/core';
import { JwtService } from '../jwt.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private jwtService: JwtService, private router: Router) { }
  admin = false;
  ngOnInit() {
    if(localStorage.getItem('admin') === 'true'){
      this.admin = true;
    }
  }

  logout(){
    this.jwtService.logout();
    this.router.navigateByUrl('login');
  }
}
