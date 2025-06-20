import { Component, computed, inject, input, signal } from '@angular/core';
import { DishorderService } from '../../service/dishorder.service';
import { DishOrderAll } from '../../model/dish.order.all.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dishorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dishorder.component.html',
  styleUrl: './dishorder.component.css'
})
export class DishorderComponent {
  private dishOrderService = inject(DishorderService);
  dishOrders = signal<DishOrderAll[]>([]);
  orderIdItem = input.required<number>();
  hasOrders = computed(() => this.dishOrders().length > 0)


  ngOnInit() {
    this.getAll()

  }
getAll() {
  this.dishOrderService.viewDishOrders().subscribe({
    next: (dishorder) => {
      const uniqueOrders: DishOrderAll[] = [];
     dishorder.forEach((order) => {
          if (
            !uniqueOrders.find(
              (u) =>
                u.orderId === order.orderId &&
                u.dishName === order.dishName &&
                u.quantity === order.quantity &&
                u.waiterName === order.waiterName
            )
          ) {
            uniqueOrders.push(order);
          }
        });
      const filter = uniqueOrders.filter(order => order.orderId === this.orderIdItem())
      this.dishOrders.set(filter);
      this.quantity(); 
    },
    error: (err) => {
      console.error('Error al obtener pedidos de bebidas', err);
    }
  });
}




quantity() {
  this.dishOrders().forEach((dishOrders:DishOrderAll) => {
    this.dishOrderService.quantity(dishOrders.orderId, dishOrders.dishId).subscribe({
      next: (quantity) => {
        console.log('Cantidad obtenida:', quantity);
        dishOrders.quantity = quantity;
              }
      }
  )})

}

  deleteDrinkOrder(orderId:number,dishId:number){
  this.dishOrderService.delete(orderId,dishId).subscribe({
    next: (deleteOrder) =>{
      // alert('se borro' + deleteOrder)
      this.getAll()
    },error: (error)=>{
      // alert("borrado")
      this.getAll()
    }
  })
}

}
