import { Component, inject, input, signal } from '@angular/core';
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
  orderId = input.required<number>()
  drinkId:number[] = []
  quantity = new FormControl('')
  orderIdOrder = new FormControl('')
  drinkIdOrder = new FormControl('')
  drinkOrderService = inject(DrinkorderService)



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

  saveOrder(drink:Drink){
    if(this.quantity.valid){
      const value = this.quantity.value
      if(value!==null){
    
    this.drinkOrderService.save(this.orderId(),drink.drinkId,parseInt(value)).subscribe({
      next:(saved)=>{
        // alert('se guardo')
        this.quantity.setValue('')
        this.getAll()
        
      },error:(error)=>{
        // alert('error al guardar la orden del platillo')
      }
    })

  }
}}


saveDrinkOrder(){
  let mensaje = ''
  let contador = 0
  this.drinks().forEach((drink)=>{
    if(drink.quantity >0){
      this.drinkOrderService.save(this.orderId(),drink.drinkId,drink.quantity).subscribe({
        next: (order)=>{
          this.quantity.setValue('')
        },error:(error)=>{
        
        }
      })
    }
  })
}

setQuantity(quantity:string, index:number){
 
  this.drinks()[index].quantity = parseInt(quantity)
  console.log(this.drinks())
}
}
  

