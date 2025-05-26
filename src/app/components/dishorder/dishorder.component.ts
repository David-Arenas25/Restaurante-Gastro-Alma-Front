import { Component, inject, input, signal } from '@angular/core';
import { DishorderService } from '../../service/dishorder.service';
import { DishOrderAll } from '../../model/dish.order.all.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dishorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dishorder.component.html',
  styleUrl: './dishorder.component.css'
})
export class DishorderComponent {

  dishOrderService = inject(DishorderService)
  dishOrders = signal<DishOrderAll[]>([])
  orderIdItem = input.required<number>()
  

  ngOnInit() {
    this.getAll()

  }
  getAll() {
    this.dishOrderService.viewDishOrders().subscribe({
      next: (dishOrders) => {
        dishOrders.forEach((dishOrder) => {
          console.log(dishOrders,'orders')
        this.dishOrders.set(dishOrders)
        })
        
      }})}


quantity() {
  
  this.dishOrders().forEach((drinkOrders:DishOrderAll) => {
    this.dishOrderService.quantity(drinkOrders.orderId, drinkOrders.dishId).subscribe({
      next: (quantity) => {
        drinkOrders.quantity = quantity;
              }
      }
  )})

}

  deleteDishOrder(orderId:number,dishId:number){
    console.log(this.dishOrders(),'oe')
    this.dishOrderService.delete(orderId,dishId).subscribe({
      next: (deleteOrder) =>{
        this.getAll()
        this.quantity()
        // alert('se borro')
      },error: (error)=>{
        // alert('error al borrar comuniquese con el admin')
        
      }
    })
  }

}
