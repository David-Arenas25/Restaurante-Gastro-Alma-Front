import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DrinkorderService } from '../../service/drinkorder.service';
import { DrinkOrderAll } from '../../model/drink.order.all.model';
import { CommonModule } from '@angular/common';
import OrderDetailComponent from '../order-detail/order-detail.component';
import { DrinkComponent } from '../drink/drink.component';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-drinkorder',
  standalone: true,
  imports: [CommonModule,RouterLinkWithHref,DrinkComponent],
  templateUrl: './drinkorder.component.html',
  styleUrl: './drinkorder.component.css',
})
export default class DrinkorderComponent {
  drinkOrderService = inject(DrinkorderService);
  drinkOrders = signal<DrinkOrderAll[]>([]);
  quantityValue!: number;
  drinkId!: number;
  orderId = input.required<number>();
  addOrder = output<string>()
  deleteOrder = output<string>()
  hasOrders = computed(() => this.drinkOrders().length > 0);

  ngOnInit() {
    this.getAll();
  }
  getAll() {
  this.drinkOrderService.viewDrinkOrders().subscribe({
    next: (drinkOrders:DrinkOrderAll[]) => {
      const uniqueOrders: DrinkOrderAll[] = [];
      drinkOrders.forEach((order) => {
        const alreadyExists = uniqueOrders.some(
          (u) =>
            u.orderId === order.orderId &&
            u.drinkName === order.drinkName
        );
        if (!alreadyExists) {
          uniqueOrders.push(order);
        }
      });

      // Filtrar por el orderId actual
      const filteredOrders = uniqueOrders.filter(
        (order) => order.orderId === this.orderId()
      );

      // Establecer los pedidos filtrados
      this.drinkOrders.set(filteredOrders);

      // Calcular cantidades u otras acciones
      this.quantity();
    },
    error: (err) => {
      console.error('Error al obtener pedidos de platos', err);
    }
  });
}


  quantity() {
    this.drinkOrders().forEach((drinkOrders: DrinkOrderAll) => {
      this.drinkOrderService
        .quantity(drinkOrders.orderId, drinkOrders.drinkId)
        .subscribe({
          next: (quantity) => {
            drinkOrders.quantity = quantity;
          },
        });
    });
  }

  deleteDrinkOrder(orderId: number, drinkId: number) {
    this.drinkOrderService.delete(orderId, drinkId).subscribe({
      next: (deleteOrder) => {
        alert()
        this.emitDeleteOrder()
        this.getAll();
      },
      error: (error) => {
        console.log(error)
        this.getAll();
      },
    });
  }
  saveDrinkOrder(drinkId:number){
    this.drinkOrderService.save(this.orderId(),drinkId,1).subscribe({
      next: (order)=>{
        this.emitUpdateOrder()
        this.getAll()
      },error:(error)=>{
        
      }
    })
  }
emitDeleteOrder(){
  this.deleteOrder.emit('borrar')
}
  emitUpdateOrder(){
    this.addOrder.emit('agregar')
  }
}

