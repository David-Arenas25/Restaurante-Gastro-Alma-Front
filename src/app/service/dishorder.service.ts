import { Injectable } from '@angular/core';
import { DishOrderAll } from '../model/dish.order.all.model';
import { BasehttpService } from './basehttp.service';
import { DishOrder } from '../model/dish.order.model';

@Injectable({
  providedIn: 'root'
})
export class DishorderService extends BasehttpService {

  viewDishOrders(){
    return this.http.get<DishOrderAll[]>(`${this.API_URL}/dishorders/view`)
   }

   save(orderId:number, dishId:number, quantity:number){
    const drinkOrder: DishOrder = { orderId, dishId, quantity };
    return this.http.post<DishOrder>(`${this.API_URL}/dishorders/save?orderId=${orderId}&dishId=${dishId}&quantity=${quantity}`,{});
  }

  quantity(orderId:number, dishId:number){
    return this.http.get<number>(`${this.API_URL}/dishorders/quantity/?idPedido=${orderId}&idBebida=${dishId}`)
   }

   delete(id:number){
    return this.http.delete(`${this.API_URL}/dishorders/delete?id=${id}`)  
   }

}

