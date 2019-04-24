import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class JwtService {
  formData: FormData = new FormData();

  constructor(private httpClient: HttpClient) { }
  login(email: string, password: string) {
    return this.httpClient.post<{ token: string }>('http://localhost:4000/api/user/login',
      { email: email, password: password }).pipe(tap(res => {
        localStorage.setItem('access_token', res.token);
      }))
  }

  register(first_name, last_name, email, password, confirm_password, address) {
    this.formData.append('first_name', first_name);
    this.formData.append('last_name', last_name);
    this.formData.append('email', email);
    this.formData.append('password', password);
    this.formData.append('confirm_password', confirm_password);
    this.formData.append('address', address);

    return this.httpClient.post<{ access_token: string }>('http://localhost:4000/api/user/create',
     this.formData).pipe(tap(res => {
      this.login(email, password)
    }))
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }

}