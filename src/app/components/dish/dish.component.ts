import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
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
  order = input.required<Order>()
  dishesId:number[] = []
  
  alerta = false;

  @Output() updateTotal = new EventEmitter<number>();

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

  saveOrder(dish:Dish){
    if(this.quantity.valid){
      const value = this.quantity.value
      if(value!==null){
    
    this.dishOrderService.save(this.order().orderId,dish.dishId,parseInt(value)).subscribe({
      next:(saved)=>{
        // alert('se guardo')
        setTimeout(() => {
          this.alerta = true
        }, 2000);
        this.quantity.setValue('')
        this.getAll()
        
      },error:(error)=>{
        // alert('error al guardar')
        this.alerta = false;}
    })

  }
}}


saveDishOrder(dishId:number){
      this.dishOrderService.save(this.order().orderId,dishId,1).subscribe({
        next: (order)=>{
          this.quantity.setValue('')
          this.getAll()
          this.updateTotal.emit(this.order().orderId);
        },error:(error)=>{
          // alert("error"+error)
          
        }
      })
    }}










