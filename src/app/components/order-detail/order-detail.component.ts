import { Component, inject, input, output, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, NgClass } from '@angular/common';
import { DishComponent } from '../dish/dish.component';
import { DrinkComponent } from '../drink/drink.component';
import { DishorderComponent } from '../dishorder/dishorder.component';
import DrinkorderComponent from '../drinkorder/drinkorder.component';
import { WaiterComponent } from '../waiter/waiter.component';
import { rxResource } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [NgClass,ReactiveFormsModule, CurrencyPipe, WaiterComponent, DishComponent, DrinkComponent, DishorderComponent, DrinkorderComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export default class OrderDetailComponent {
  readonly slug = input.required<number>();
  private orderService = inject(OrderService);
  orderDetail = signal<Order>({} as Order);
    orders = signal<Order[]>([]);
    activePaymentId: number | null = null;
    quantity = new FormControl('');
    showDishes = true;
    showDrinks = false;
    showWaiter = false;
    showPayment = true;
    oneOrder!: Order | null;
    orderId = new FormControl('');
    state = signal('todos');
    waiterId = new FormControl('');
    showOrderPanel = true
    showPanel = output<boolean>();

  ngOnInit(){
    this.getById();
  }

  getById(){
    return this.orderService.getById(this.slug()).subscribe({
      next: (data) => {
        this.orderDetail.set(data);
      }
    })
  }
  showingDrinks(orderId: number) {
    this.showPayment = false;
    this.showDishes = false;
    this.showDrinks = !this.showDrinks;
    this.showWaiter = false;
  }

  showingDishes(orderId: number) {
    this.showDishes = true;
    this.showDrinks = false;
    this.showWaiter = false;
    this.showPayment = true;
    }
  
  showingWaiters(orderId: number) {
    this.showDishes = false;
    this.showDrinks = false;
    this.showWaiter = !this.showWaiter;
  }
     showOrdersPanel(panel: boolean) {
    this.showPanel.emit(panel);
  }

   pay(orderId: number, status: string) {
    if (status === 'PAGADO' || status === 'CAMBIO') {
      return;
    }
    if (this.quantity.valid && orderId) {
      const quantityValue = this.quantity.value;
      if (quantityValue !== null) {
        const quantityNumber = parseFloat(quantityValue);
        // if (quantityNumber > 0) {
        // if (
        //   this.oneOrder &&
        //   Math.abs(quantityNumber - this.oneOrder.total) < 0.01
        // )
        // {
        this.orderService.pay(quantityNumber, orderId).subscribe({
          next: (payment) => {
            console.log('Pago realizado:');
            this.quantity.setValue('');
            this.oneOrder = payment;
          },
        });
      }
    }
  }
  updatePrice(orderId: number) {
    if (orderId !== null) {
      this.orderService.calculateTotal(orderId).subscribe({
        next: (total) => {
          if (this.oneOrder && this.oneOrder.orderId) {
          }
        },
      });
    }
  }


}
