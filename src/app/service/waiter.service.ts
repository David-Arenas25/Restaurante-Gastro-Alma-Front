import { Injectable } from '@angular/core';
import { BasehttpService } from './basehttp.service';
import { Waiter } from '../model/waiter.model';

@Injectable({
  providedIn: 'root'
})
export class WaiterService extends BasehttpService {

  getAll(){
    return this.http.get<Waiter[]>(`${this.API_URL}/waiters/all`)
   }
}
