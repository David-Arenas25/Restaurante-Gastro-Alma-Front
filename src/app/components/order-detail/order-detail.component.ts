import { Component, inject, input, output, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { DishComponent } from '../dish/dish.component';
import { DrinkComponent } from '../drink/drink.component';
import { DishorderComponent } from '../dishorder/dishorder.component';
import DrinkorderComponent from '../drinkorder/drinkorder.component';
import { ActivatedRoute, Route, Router, RouterLinkWithHref } from '@angular/router';
import { OrderStatusService } from 'src/app/service/order-status.service';


@Component({
  selector: 'app-order-detail',
  standalone:true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    NgClass,
    ReactiveFormsModule,
    CurrencyPipe,
    DishComponent,
    DrinkComponent,
    DishorderComponent,
    DrinkorderComponent,
  ],
  templateUrl: './order-detail.component.html',

})
export default class OrderDetailComponent {
  orderDetail = signal<Order>({} as Order);
  orders = signal<Order[]>([]);
  activePaymentId: number | null = null;
  quantity = new FormControl('');
  showDishes = true;
  showDrinks = true;
  showWaiter = false;
  showPayment = false;
  oneOrder!: Order | null;
  orderId = new FormControl('');
  state = signal('todos');
  waiterId = new FormControl('');
  showOrderPanel = true;
  showPanel = output<boolean>();
  constructor(readonly orderStatus:OrderStatusService,private readonly orderService:OrderService,private router:Router) {}

 ngOnInit() {
    
  }
  showPay() {
    this.showPayment = true;
    this.showDishes = false;
    this.showDrinks = false;

  }

  getById(orderStatus: number) {
    if (orderStatus) {
      this.orderService.getById(orderStatus).subscribe({
        next: (data) => {
          this.orderDetail.set(data);
          this.updatePrice(data.orderId)
        },
      });
    }
  }
  order() {
    this.showDishes = true;
    this.showDrinks = false;
    this.showPayment = false;
  }

  showOrder() {
    this.showDishes = false;
    this.showDrinks = true;
    this.showPayment = false;
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
    this.showPayment = false;
  }
  showOrdersPanel(panel: boolean) {
    if (panel) {
      this.showPanel.emit(false);
      return;
    }
    this.showPanel.emit;
  }

  pay(orderId: number, status: string) {
    if (status === 'PAGADO' || status === 'CAMBIO') {
      alert('ya se ha procesado el pago');
      return;
    }
    if (this.quantity.valid && orderId) {
      const quantityValue = this.quantity.value;
      if (quantityValue !== null) {
        const quantityNumber = parseFloat(quantityValue);
        this.orderService.pay(quantityNumber, orderId).subscribe({
          next: (payment) => {
            this.quantity.setValue('');
            this.orderDetail.set(payment);
          },
        });
      }
    }
  }
  updatePrice(orderId: number) {
    if (orderId !== null) {
      this.orderService.calculateTotal(orderId).subscribe({
        next: (total) => {
          this.orderDetail().total = total;
        },
      });
    }
  }
}
