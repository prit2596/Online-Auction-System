import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivebidService {

  private url = 'http://localhost:4000';
  private socket;

  constructor() {
    this.socket = io(this.url);
   }

  joinAuction(itemId, userId){
    var data = {
      'itemId': itemId,
      'userId': userId
    }
    this.socket.emit('join_auction', data);
  }

  totalUsers(): Observable<any>{
    return new Observable<any> (observer => {
      this.socket.on('totalUsers', (data) => {
        observer.next(data)
    });
      
  })
  }
}
