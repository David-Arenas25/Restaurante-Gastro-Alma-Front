import { Component, inject, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DishComponent } from '../dish/dish.component';
import { DrinkComponent } from "../drink/drink.component";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, DishComponent, DrinkComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export default class OrderComponent {

  orderService = inject(OrderService)
  orders = signal<Order[]>([])
  activePaymentId:number | null = null
  quantity = new FormControl('')
  order!:Order

  ngOnInit(){
    this.getAll()
  }


 
  getAll() {
    this.orderService.getAll().subscribe({

      next: (value) => {
        this.orders.set(value);
      },
      error: (error) => {
        console.error("Error fetching orders:", error);
      }
    });
  }

  pay(orderId:number){
    if(this.quantity.valid){
      const quantityValue = this.quantity.value
      if(quantityValue !== null){
    this.orderService.pay(parseInt(quantityValue),orderId).subscribe({
      next: (payment) => {console.log('pago correcto')
      this.getAll()
      this.quantity.setValue('')
      }
    })
  }
    }}

  activeOrderPayment(orderId:number){

    if(this.activePaymentId === orderId){
    this.activePaymentId = null
  }else{
    this.activePaymentId = orderId
  }
}

  updatePrice(orderId: number) {

    let idOrderCall = this.orderService.getById(orderId).subscribe({
      next: (order) => {
        this.order = order
      }
    })

    if(this.order.status.toLocaleLowerCase() === 'cambio' || this.order.status.toLocaleLowerCase() === 'pagado' && this.order.total > 0){
      this.order.status = 'pendiente'
    }
    return this.orderService.calculateTotal(orderId).subscribe({
      next: (order) => {

        console.log('orden registrada correctamente')
        this.getAll()
      }

    })
  }
  }
 

