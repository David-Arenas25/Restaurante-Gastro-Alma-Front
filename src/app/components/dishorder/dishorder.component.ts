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
      next: orders => {
        this.dishOrders.set(orders);
        this.dishOrders().forEach(dishOrder => {
          if (dishOrder.idPedido === this.orderIdItem()) {
            this.quantity(this.orderIdItem(), dishOrder.idPlato); // Llamada a la función quantity para cada plato
          }
        }); 
      },
      error: error => console.error('Error:', error)
    });
  }

  quantity(orderId: number, drinkId: number) {
    this.dishOrderService.quantity(orderId, drinkId).subscribe({
      next: (quantity) => {
        this.dishOrders().forEach(element => {
          if (element.idPlato === drinkId) {
            element.quantity = quantity;
          }
        });
      }
    });
  }

  deleteDishOrder(orderId:number){
    this.dishOrderService.delete(orderId).subscribe({
      next: (deleteOrder) =>{
        alert('se borro')
      },error: (error)=>{
        alert('error al borrar comuniquese con el admin')
        this.getAll()
      }
    })
  }

}
