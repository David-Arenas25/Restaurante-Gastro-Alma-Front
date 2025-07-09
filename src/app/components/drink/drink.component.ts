import { Component, EventEmitter, inject, input, output, Output, signal } from '@angular/core';
import { DrinkService } from '../../service/drink.service';
import { Drink } from '../../model/drink.model';
import DrinkorderComponent from "../drinkorder/drinkorder.component";
import { DrinkOrder } from '../../model/drink.order.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DrinkorderService } from '../../service/drinkorder.service';

@Component({
  selector: 'app-drink',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './drink.component.html',
  styleUrl: './drink.component.css'
})
export class DrinkComponent {

  drinkService = inject(DrinkService)
  drinks = signal<Drink[]>([])

  drinkId:number[] = []
  quantity = new FormControl('')
  orderIdOrder = new FormControl('')
  drinkIdOrder = new FormControl('')
  drinkOrderService = inject(DrinkorderService)
  drink = output<number>()



  ngOnInit(){
    this.getAll()
  }

  getAll(){

    this.drinkService.getAll().subscribe({
      next: drink=>{
        this.drinks.set(drink)
   
      }
    })
  }

emitDrinkOrder(drinkId:number){
  this.drink.emit(drinkId)
}
  

}


