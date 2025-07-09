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

   save(waiter: Waiter){
    return this.http.post<Waiter>(`${this.API_URL}/waiters/save`, waiter)
   }
   update(waiter: Waiter){
  return this.http.put<Waiter>(`${this.API_URL}/waiters/${waiter.waiterId}`, waiter);
}

}
