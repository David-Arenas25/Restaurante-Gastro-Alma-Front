import { Component, computed, inject, input, output, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DishComponent } from '../dish/dish.component';
import { DrinkComponent } from '../drink/drink.component';
import DrinkorderComponent from '../drinkorder/drinkorder.component';
import { DishorderComponent } from '../dishorder/dishorder.component';
import { WaiterComponent } from '../waiter/waiter.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    DishComponent,
    DrinkComponent,
    DrinkorderComponent,
    DishorderComponent,
    WaiterComponent,
    CurrencyPipe,
    NgClass,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export default class OrderComponent {
  orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  activePaymentId: number | null = null;
  quantity = new FormControl('');
  order!: Order;
  showDishes = true;
  showDrinks = false;
  showWaiter = false;
  showPayment = false;
  oneOrder!: Order | null;
  orderId = new FormControl('');
  state = signal('todos');
  waiterId = new FormControl('');
  orderIdTable = input<number>(0)
  showPanel = output<boolean>();
  showOrderPanel = true



  ngOnInit() {
    this.getAll()
    
  }
  getById(orderId: number) {
    if (orderId) {
      this.orderService.getById(orderId).subscribe({
        next: (order) => {
          this.oneOrder = order;
          this.updatePrice(this.oneOrder.orderId);
        },
      });
    }
  }

  changeFilter(filter: string) {
    this.state.set(filter);
  }

  saveOrder() {
    if (this.waiterId.valid) {
      const today = new Date();
      const value = this.waiterId.value;
      if (value !== null) {
        const newOrder = {
          orderId: 0,
          orderDate: today,
          total: 0,
          status: 'PENDIENTE',
          waiterId: parseInt(value),
          cambio: 0,
          tableId: this.orderIdTable(),
        };
        const getWaiter = this.orderService.save(newOrder).subscribe({
          next: (order) => {
            // alert('orden guardada '+ order.orderId)
            this.getAll();
            this.waiterId.setValue('');
          },
          error: (error) => {
            // alert('error su orden no se guardó'+error)
          },
        });
      } else {
        // alert('ingrese id de mesero por favor')
      }
    }
  }

  deleteOrder(orderId: number) {
    return this.orderService.delete(orderId).subscribe({
      // next: order => {alert('se borro ' + orderId)
      next: (order) => {
        this.getAll();
      },

      error: (error) => {
        alert('Error al borrar la orden comuníquese con el administrador');
      },
    });
  }
  showAnithing(orderId: number) {
    if (this.oneOrder?.orderId !== orderId) {
      this.oneOrder = null;
    }
    this.getById(orderId);
    this.showDishes = true;
  }
  showingDrinks(orderId: number) {
    this.getById(orderId);
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
    if (this.oneOrder?.orderId !== orderId) {
      this.oneOrder = null;
    }
    this.getById(orderId);
  }
  showingWaiters(orderId: number) {
    this.getById(orderId);
    this.showDishes = false;
    this.showDrinks = false;
    this.showWaiter = !this.showWaiter;
  }

  getAll() {
    this.orderService.getAll().subscribe({
      next: (value) => {
        this.orders.set(value);
      
      },
    });
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

  activeOrderPayment(orderId: number) {
    this.updatePrice(orderId);
    if (this.activePaymentId === orderId) {
      this.activePaymentId = null;
    } else {
      this.activePaymentId = orderId;
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

  filterView() {
    const viewAllCopy = this.orders();
    const stateCopy = this.state();

    if (stateCopy === 'todos') {
      const filter  = viewAllCopy.filter((order) => order.tableId === this.orderIdTable());
      this.oneOrder = filter[0]
      return filter;
    }

    if (stateCopy === 'id' && this.orderId.valid) {
      const idValue = this.orderId.value;
      if (idValue !== null) {
        const vAllCopy = viewAllCopy.filter(
          (order) => order.orderId === parseInt(idValue)
        );
        return vAllCopy;
      }
    }
    if (stateCopy === 'date') {
      const today = new Date().toISOString().slice(0, 10);

      const todayOrders = viewAllCopy.filter((order) => {
        return new Date(order.orderDate).toISOString().slice(0, 10) === today;
      });

      return todayOrders;
    }

    return viewAllCopy;
  }
   showOrdersPanel(panel: boolean) {
    this.showPanel.emit(panel);
  }
}
