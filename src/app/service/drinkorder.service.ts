import { Injectable } from '@angular/core';
import { DrinkOrderAll } from '../model/drink.order.all.model';
import { BasehttpService } from './basehttp.service';
import { DrinkOrder } from '../model/drink.order.model';

@Injectable({
  providedIn: 'root'
})
export class DrinkorderService extends BasehttpService {

  viewDrinkOrders(){
    return this.http.get<DrinkOrderAll[]>(`${this.API_URL}/drinkorders/view`)
   }

   quantity(orderId:number, drinkId:number){
    return this.http.get<number>(`${this.API_URL}/drinkorders/quantity/?idPedido=${orderId}&idBebida=${drinkId}`)
   }
  

   save(orderId:number, drinkId:number, quantity:number) {
    return this.http.post<DrinkOrder>(`${this.API_URL}/drinkorders/save?orderId=${orderId}&drinkId=${drinkId}&quantity=${quantity}`,{});
  }

  delete(id:number){
    return this.http.delete(`${this.API_URL}/drinkorders/delete?id=${id}`)
  
   }
   
}

