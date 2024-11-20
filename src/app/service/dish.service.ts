import { Injectable } from '@angular/core';
import { BasehttpService } from './basehttp.service';
import { Dish } from '../model/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishService extends BasehttpService {

  getAll(){
    return this.http.get<Dish[]>(`${this.API_URL}/dishes/all`)
   }
}
