import { Component, inject, input, output, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { DishComponent } from '../dish/dish.component';
import { DrinkComponent } from '../drink/drink.component';
import { DishorderComponent } from '../dishorder/dishorder.component';
import DrinkorderComponent from '../drinkorder/drinkorder.component';
import { WaiterComponent } from '../waiter/waiter.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [NgClass,ReactiveFormsModule, CurrencyPipe, WaiterComponent, DishComponent, DrinkComponent, DishorderComponent, DrinkorderComponent],
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
  styleUrl: './order-detail.component.css',
})
export default class OrderDetailComponent {
  private route = inject(ActivatedRoute);
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
  orders = signal<Order[]>([]);
  activePaymentId: number | null = null;
  quantity = new FormControl('');
  showDishes = true;
  showDrinks = false;
  showWaiter = false;
  showPayment = false;
  oneOrder!: Order | null;
  orderId = new FormControl('');
  state = signal('todos');
  waiterId = new FormControl('');
  showOrderPanel = true;
  showPanel = output<boolean>();
  slug!: number;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slugParam = params.get('slug');
      if (slugParam) {
        this.slug = +slugParam;
        this.getById(this.slug);
      } else {
      }
    });
  }
  showPay() {
    this.showPayment = true;
    this.showDishes = false;
    this.showDrinks = false;
  }

  getById(slug: number) {
    if (slug) {
      this.orderService.getById(slug).subscribe({
        next: (data) => {
          this.orderDetail.set(data);
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
      alert('ya se ha procesado el pago')
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
          console.log('total',total)
          this.orderDetail().total = total;
        },
      });
    }
  }
}
  
