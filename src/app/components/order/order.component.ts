import { Component, inject, input, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { OrderStatusService } from 'src/app/service/order-status.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgClass,
    ReactiveFormsModule,
    RouterLinkWithHref
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
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
  showOrderPanel = true
  filter = signal<Order[]>([])
  slug = 0
  route = inject(ActivatedRoute)
  tableMessage = `No ha seleccionado Mesa`
  orderStatus = inject(OrderStatusService);

  ngOnInit() {
    this.getAll()
  
  }
   
    updateStatus(status: string, orderId: number) {
  let newStatus: string;
  
  if (status === 'PENDIENTE') {
    newStatus = 'ENTREGADO';
  } else if (status === 'ENTREGADO') {
    newStatus = 'PENDIENTE';
  } else {
    // Si tiene otro estado, mantener el estado actual o definir un comportamiento por defecto
    newStatus = status;
  }

  this.orderService.updateStatus(orderId, newStatus).subscribe({
    next: () => {
      this.getAll();
      console.log(this.orders());
    },
    error: (error) => {
      console.error('Error al actualizar el estado:', error);
    }
  });
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
          tableId: this.orderStatus.tableId,
        };
        const getWaiter = this.orderService.save(newOrder).subscribe({
          next: (order) => {
            this.getAll();
            this.waiterId.setValue('');
          },
          error: (error) => {
          },
        });
      } else {
      }
    }
  }

  deleteOrder(orderId: number) {
    return this.orderService.delete(orderId).subscribe({
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
  getAll() {
    this.orderService.getAll().subscribe({
      next: (value) => {
        this.orders.set(value);
          this.filterView();
      
      },
    });
  }

  updatePrice(orderId: number) {
    if (orderId !== null) {
      this.orderService.calculateTotal(orderId).subscribe({
      });
    }
  }

filterView() {
  const status = this.orderStatus.tableId;

  status
    ? this.orderService.updateStatus(status).subscribe({
        next: (viewAllCopy) => {
          this.filter.set(viewAllCopy);
        }
      })
    : this.filter.set(this.orders());
}


  searchById() {
    const idValue = this.orderId.value;
    if(idValue){
    const searchFilter = this.orders().filter(
    (order) => order.orderId.toString().includes(idValue))
    this.filter.set(searchFilter)
    }else{
      this.filterView()
    }}


  setOrderId(orderId: number) {
    this.orderStatus.orderId = orderId;
  }


}
