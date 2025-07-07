import { Component, computed, inject, input, signal } from '@angular/core';
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

  hasOrders = computed(() => this.drinkOrders().length > 0);

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.drinkOrderService.viewDrinkOrders().subscribe({
      next: (drinkOrders) => {
        if(!this.orderId()){
          return
        }
        const uniqueOrders: DrinkOrderAll[] = [];
        drinkOrders.forEach((order) => {
          if (
            !uniqueOrders.find(
              (u) =>
                u.orderId === order.orderId &&
                u.drinkName === order.drinkName &&
                u.quantity === order.quantity &&
                u.waiterName === order.waiterName
            )
          ) {
            uniqueOrders.push(order);
          }
        });
        console.log(uniqueOrders,this.orderId())
        const filter = uniqueOrders.filter(
          (order) => order.orderId === this.orderId()
        );
        this.drinkOrders.set(filter);
        console.log(this.drinkOrders(), 'orders')
        this.quantity();
      },
      error: (err) => {
        console.error('Error al obtener pedidos de bebidas', err);
      },
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
        // alert('se borro' + deleteOrder)
        this.getAll();
      },
      error: (error) => {
        // alert("borrado")
        this.getAll();
      },
    });
  }
  saveDrinkOrder(drinkId:number){
    this.drinkOrderService.save(this.orderId(),drinkId,1).subscribe({
      next: (order)=>{
        this.getAll()
      },error:(error)=>{
        
      }
    })
  }
}

