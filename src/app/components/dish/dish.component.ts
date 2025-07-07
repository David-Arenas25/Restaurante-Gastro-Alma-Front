import { Component, EventEmitter, inject, input, output, Output, signal } from '@angular/core';
import { DishService } from '../../service/dish.service';
import { Dish } from '../../model/dish.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DishorderService } from '../../service/dishorder.service';
import { Order } from '../../model/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dish',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.css'
})
export class DishComponent {

  dishes = signal<Dish[]>([])
  dishService = inject(DishService)
  quantity = new FormControl('',Validators.required)
  dishOrderService = inject(DishorderService)
  dishesId:number[] = []
  dish = output<number>()
  alerta = false;


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

  emitDishOrder(dishId:number){
    this.dish.emit(dishId)

  }
}









