import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserServiceService } from '../service/user-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  load: Boolean= false;
  editForm: FormGroup;
  user: any= {};
  constructor(private userService: UserServiceService, private fb: FormBuilder, private router: Router) {
    this.createForm();
   }

  ngOnInit() {
    this.userService.getUserById(localStorage.getItem('userId'))
    .subscribe(res => {
      this.user = res.user;
      ////.log(this.user.first_name)
      this.editForm.get('first_name').setValue(this.user.first_name);
      this.editForm.get('last_name').setValue(this.user.last_name);
      this.editForm.get('address').setValue(this.user.address);
      this.editForm.get('email').setValue(this.user.email);
    })
  }

  createForm(){
    this.editForm = this.fb.group({
      first_name : ['', Validators.required],
      last_name : ['', Validators.required],
      address : ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  updateUser(first_name, last_name, address){
    this.userService.updateUser(first_name, last_name, address, this.user.email)
    .subscribe((data)=> {
      this.router.navigateByUrl('')
    });
  }

}
