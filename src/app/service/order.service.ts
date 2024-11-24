
import { Injectable } from '@angular/core';
import { BasehttpService } from './basehttp.service';
import { Order } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BasehttpService {


  getAll(){
    return this.http.get<Order[]>(`${this.API_URL}/orders/all`)
  }

  pay(total:number,orderId:number){
    return this.http.get(`${this.API_URL}/orders/pagar?total=${total}&orderId=${orderId}`,{})
   }

  calculateTotal(id:number){
    return this.http.get(`${this.API_URL}/orders/total?id=${id}`,{})
   }

   
   getById(id:number){
    return this.http.get<Order>(`${this.API_URL}/orders/id/${id}`)
   }

   save(order:Order){
    return this.http.post<Order>(`${this.API_URL}/orders/save`,order)
   }
   
   delete(id:number){
    return this.http.delete(`${this.API_URL}/orders/delete/${id}`)
  
   }


}

