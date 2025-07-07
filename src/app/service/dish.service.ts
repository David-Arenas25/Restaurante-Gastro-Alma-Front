import { Injectable } from '@angular/core';
import { BasehttpService } from './basehttp.service';
import { Dish } from '../model/dish.model';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DishService extends BasehttpService {

  getAll(){
    return this.http.get<Dish[]>(`${this.API_URL}/dishes/all`)
   }

  save(dish: Dish) {
    return this.http.post<Dish>(`${this.API_URL}/dishes/save`, dish);
  }
}
