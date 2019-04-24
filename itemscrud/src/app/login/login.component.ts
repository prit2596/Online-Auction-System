import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { JwtService } from  '../jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted  =  false;

  get formControls() { return this.loginForm.controls; }

  constructor(private JwtService: JwtService, private router: Router, private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.loginForm  =  this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    // console.log(this.loginForm.value);
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.JwtService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((data)=>{
      // to control which locations get jwt token, edit app.modules.ts
      // JwtModule.forRoot whitelistedDomains and blackListedDomains.
      
      if(data['message'] !== 'login success'){
        alert("invalid email or password");
        // route to login page
      }
      else{
        // alert(localStorage.getItem('access_token'));
        // this.router.navigateByUrl('home');   route to dashboard
        console.log(data['user']);
        localStorage.setItem('userId', data['user'].email);
        localStorage.setItem('admin', data['user'].admin);
        this.router.navigateByUrl('');
      }
    });
    // this.router.navigateByUrl('/admin');
    
  }

}
