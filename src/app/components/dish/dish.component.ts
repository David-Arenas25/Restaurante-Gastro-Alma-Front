import { Component, inject, input, signal } from '@angular/core';
import { DishService } from '../../service/dish.service';
import { Dish } from '../../model/dish.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DishorderService } from '../../service/dishorder.service';
import { Order } from '../../model/order.model';

@Component({
  selector: 'app-dish',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.css'
})
export class DishComponent {

  dishes = signal<Dish[]>([])
  dishService = inject(DishService)
  quantity = new FormControl(Validators.required)
  dishOrderService = inject(DishorderService)
  order = input.required<Order>()
  dishesId:number[] = []


  ngOnInit(){
    this.getAll()
  }

  getAll(){
    this.dishService.getAll().subscribe({
      next: dishes =>{
        this.dishes.set(dishes)
      }
    })
  }

  saveOrder(dishId:number){
    if(this.quantity.valid){
      const value = this.quantity.value
      if(value!==null){
    
    this.dishOrderService.save(this.order().orderId,dishId,parseInt(value)).subscribe({
      next:(saved)=>{
        alert('se guardo')
        this.quantity.setValue([])
        this.getAll()        
      },error:(error)=>{
        alert('error al guardar la orden del platillo')
      }
    })

  }
}}


}


