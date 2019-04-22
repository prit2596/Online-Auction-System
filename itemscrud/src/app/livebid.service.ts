import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class LivebidService {

  private url = 'http://localhost:4000';
  private socket;

  constructor() {
    this.socket = io(this.url);
   }
}
