import { Component, inject, input, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';

@Component({
    selector: 'app-order',
    imports: [
        DatePipe,
        ReactiveFormsModule,
        CurrencyPipe,
        NgClass,
        RouterLinkWithHref,
        
      
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

  ngOnInit() {
    let param =  localStorage.getItem('tableId')
    this.route.paramMap.subscribe((params:any) => {
      const slugParam = params.get('slug');
      if (slugParam) {
        this.slug = +slugParam;
      }
      else if(param){
        
        this.slug = +param
        
      }else{
        this.tableMessage = 'No ha seleccionado ninguna mesa'
      } 
      
    })
    
      

    this.tableMessage = `Mesa ${this.slug}`
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
          tableId: this.slug,
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
       if (this.slug) {
 
      this.filter.set(viewAllCopy.filter((order) => order.tableId === this.slug))
      this.oneOrder = this.filter()[0]
     

 
    }else{
      
      this.filter.set(this.orders())
    }
  }

  searchById() {
        if ( this.orderId.valid && this.orderId.value !== '') {
      const idValue = this.orderId.value;
      if (idValue !== null) {
        this.filter.set(this.orders().filter(
          (order) => order.orderId === parseInt(idValue)))
  }else{
    const idFilter = this.orders().filter(order => order.tableId === this.slug)
    this.filter.set(idFilter)
  }
        }}


  setOrderId(orderId: number) {
    localStorage.setItem('orderId', orderId.toString())
  }

  listAllOrders(event: Event){
    if (event.type === 'click') {
      this.filter.set(this.orders())
      this.tableMessage = 'Todos Los Pedidos'
    } else if (event.type === 'blur') {
      this.filter.set(this.orders().filter(order => order.tableId === this.slug))
      this.tableMessage = `Mesa ${this.slug}`
    }
  }
}
