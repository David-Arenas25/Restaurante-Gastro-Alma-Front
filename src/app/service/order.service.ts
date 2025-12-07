
import { Injectable } from '@angular/core';
import { BasehttpService } from './basehttp.service';
import { Order } from '../model/order.model';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
     updateStatuss(params: { idMesa: string; estado?: string }) {
    const url = new URL(`${this.API_URL}/orders/filtrar`);
    if (params.idMesa) {
      url.searchParams.set('ID_MESA', params.idMesa.toString());
    }
    if (params.estado) {
      url.searchParams.set('categorySlug', params.estado);
    }
    return this.http.get<Order[]>(url.toString());
  }
 
updateStatus(idMesa: number, estado?: string): Observable<Order[]> {
  if(!estado){
    estado = 'null'
  }
  return this.http.get<Order[]>(`${this.API_URL}/orders/filtrar?ESTADO=${estado}&ID_MESA=${idMesa}`,{})

   }


  }

