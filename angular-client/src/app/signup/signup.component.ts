import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { UserServiceService} from '../service/user-service.service';
import {NgForm} from '@angular/forms';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
// import { equalPasswordValidator } from '../shared/equal-password.directive';
import {ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  formData: FormData;
  imageFlag: Boolean = false;
  userExistsFlag = false;
  constructor(private userService: UserServiceService, private fb: FormBuilder, private cd: ChangeDetectorRef, private router: Router) {
    this.createForm();
    this.formData = new FormData();
   }

  createForm(){
    this.signUpForm = this.fb.group({
      first_name : ['', Validators.required],
      last_name : ['', Validators.required],
      email : ['', Validators.required],
      password : ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirm_password : ['', Validators.required],
      address : ['', Validators.required]
    });
  }
  ngOnInit() {
    
  }

  addUser(first_name, last_name, email, password, confirm_password, address){
    
    this.formData.append('first_name', first_name);
    this.formData.append('last_name', last_name);
    this.formData.append('email', email);
    this.formData.append('password', password);
    this.formData.append('confirm_password', confirm_password);
    this.formData.append('address', address);
    
    this.userService.addUser(this.formData)
    .subscribe(res => this.router.navigateByUrl('/login'));
  }

  onFileChange(event) {
    
    let reader = new FileReader();
     console.log("change file")
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.signUpForm.patchValue({
          file: reader.result
        });
        console.log(file)
        // need to run CD since file load runs outside of zone
        this.formData.append('profilePic', file)
        this.cd.markForCheck();
        this.imageFlag = true;
      };
    }
  }

  checkEmail(event){

    this.userService.getUserById(this.signUpForm.get('email').value)
    .subscribe(res => {
      if(res.user === null){
        this.userExistsFlag = false;
        //console.log("null");
      }
      else{
        this.userExistsFlag = true;
        //console.log("user exists");
      }
    })
  }


}
