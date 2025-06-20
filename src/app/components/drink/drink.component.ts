import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
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
  @Output() updateTotal = new EventEmitter<number>();



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


saveDrinkOrder(drinkId:number){
    this.drinkOrderService.save(this.orderId(),drinkId,1).subscribe({
      next: (order)=>{
        this.quantity.setValue('');
        this.updateTotal.emit(this.orderId());
      },error:(error)=>{
        
      }
    })
  }
  

}


