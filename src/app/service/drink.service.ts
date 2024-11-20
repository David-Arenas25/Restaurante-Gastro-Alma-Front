import { Injectable } from '@angular/core';
import { Drink } from '../model/drink.model';
import { BasehttpService } from './basehttp.service';

@Injectable({
  providedIn: 'root'
})
export class DrinkService extends BasehttpService {

  
  getAll(){
    return this.http.get<Drink[]>(`${this.API_URL}/drinks/all`)
   }
}
