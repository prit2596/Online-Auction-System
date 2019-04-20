import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ItemService {

  uri = 'http://localhost:4000/api/items';
  constructor(private http: HttpClient, private router: Router) { }
  
  addAdItem(formData) : any {
    return this.http.post<any>(`${this.uri}/create`, formData);
    
  }
  
  getItems() {
    return this
           .http
           .get(`${this.uri}/upcomingItems`);
    }

  editItem(id){
  return this
            .http
            .get(`${this.uri}/getItem/${id}`);
  }

  updateItem(formdata,id) {

  this
    .http
    .put(`${this.uri}/updateItem/${id}`, formdata)
    .subscribe(res => console.log('Done'));
}

deleteItem(id){
  return this
              .http
              .delete(`${this.uri}/deleteItem/${id}`);
}

getSoldItems(){
  return this.http.get(`${this.uri}/getsoldItems`);
}
}
