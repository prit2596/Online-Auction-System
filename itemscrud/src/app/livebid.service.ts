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
    console.log('in constructor');
    this.socket = io(this.url);
   }

  joinAuction(itemId, userId){
    console.log('join_auction');
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
  })}


  addBid(itemId, userId, bid){
    var data = {
      'itemId': itemId,
      'userId': userId,
      'bid': bid
    }

    this.socket.emit('new_bid', data);
  }

  leaveAuction(){
    var data = {}
    this.socket.emit('forceDisconnect', data);
  }

  fetchBidLogs(itemId){
    var data = {
      'itemId': itemId
    }
    this.socket.emit('fetch_bid_logs', data);
  }

  firstTimeLogs(): Observable<any>{
    return new Observable<any> (observer => {
      this.socket.on('bid_logs', (data) => {
        observer.next(data)
    });
  })}

  postedBid(): Observable<any>{
    return new Observable<any> (observer => {
      this.socket.on('posted_bid', (data) => {
        observer.next(data)
      });
    });
  }

  timeOut(itemId){
    console.log('timeout in service');
    var data = {
      'itemId': itemId
    }
    this.socket.emit('timeout', data)
  }

  winner(): Observable<any>{
    return new Observable<any>(observer => {
      this.socket.on('winner', (data) => {
        observer.next(data);
      });
    });

  }
}