import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private usersUrl = 'http://localhost:4000/api/user/';

  constructor(private http: HttpClient) { }


  addUser(formData: FormData): any{
    ////.log(formData);
    ////.log("in service class");
    return this.http.post<any>(`${this.usersUrl}/create`,formData);
  }

  getUserById(email: string): Observable<any>{
    return this.http.get<any>(`${this.usersUrl}/getUser/${email}`);
  }

  updateUser(first_name, last_name, address, email): any{
    var updateData = {
      first_name: first_name,
      last_name: last_name,
      address: address
    }

    return this.http.put<any>(`${this.usersUrl}/updateUser/${email}`, updateData)
  }
}
