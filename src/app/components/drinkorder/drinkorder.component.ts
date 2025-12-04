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
  this.drinkOrderService.viewDrinkOrders(this.orderId()).subscribe({
    next: (drinkOrders) => {
      this.drinkOrders.set(drinkOrders);
      this.quantity()
}})}


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

