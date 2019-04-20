import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveService {
  uri = 'http://localhost:4000/api/items/'
  constructor(private http : HttpClient) { }
  
  getLiveItems(): Observable<any>{
    return this.http.get(`${this.uri}/liveItems`);
  }

}
