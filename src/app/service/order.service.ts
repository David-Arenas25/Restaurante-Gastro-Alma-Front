
import { Injectable } from '@angular/core';
import { BasehttpService } from './basehttp.service';
import { Order } from '../model/order.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BasehttpService {


  getAll(){
    return this.http.get<Order[]>(`${this.API_URL}/orders/all`)
  }

  pay(total:number,orderId:number){
    return this.http.get<Order>(`${this.API_URL}/orders/pagar?total=${total}&orderId=${orderId}`,{})
   }

  calculateTotal(id:number){
    return this.http.get<number>(`${this.API_URL}/orders/total?id=${id}`,{})
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
 updateStatus(estado: string, idPedido: number) {
    const params = new HttpParams()
      .set('estado', estado)
      .set('idPedido', idPedido.toString());

    return this.http.put<void>(`${this.API_URL}/orders/actualizar`, null, { params });
  }
   }




