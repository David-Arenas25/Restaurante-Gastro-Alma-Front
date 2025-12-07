import { Component, inject, input, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { OrderStatusService } from '../../service/order-status.service';
//import { resource } from '@angular/core';
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
  route = inject(ActivatedRoute)
  tableMessage = `No ha seleccionado Mesa`
  orderStatus = inject(OrderStatusService);
  $slug = input.required<string>({alias: 'slug'});  

  ngOnInit() {
    this.getAll()
  

  }
  // productsResource = resource({
  //   request: () => ({ idMesa: this.$slug() }),
  //   loader: ({ request }: { request: { idMesa: string } }) => this.orderService.updateStatuss({idMesa:request.idMesa}),
  // });
   
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
      },
    });
  }

  updatePrice(orderId: number) {
    if (orderId !== null) {
      this.orderService.calculateTotal(orderId).subscribe({
      });
    }
  }


  searchById() {
    const idValue = this.orderId.value;
    if(idValue){
    const searchFilter = this.orders().filter(
    (order) => order.orderId.toString().includes(idValue))
    this.filter.set(searchFilter)
    }else{
      this.filter.set(this.orders())
    }}


  setOrderId(orderId: number) {
    this.orderStatus.orderId = orderId;
  }


}
