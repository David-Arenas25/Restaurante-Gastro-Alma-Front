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

  // Computed signal para los platos filtrados
  filteredOrders = computed(() => {
    return this.dishOrders().filter(order => order.orderId === this.orderIdItem());
  });

  // Computed signal para verificar si hay platos
   hasOrders = computed(() => this.filteredOrders().length > 0)


  ngOnInit() {
    this.getAll()

  }
getAll() {
  this.dishOrderService.viewDishOrders().subscribe({
    next: (dishorder) => {
      // Filtra para que solo quede un pedido por drinkName
      const uniqueOrders: DishOrderAll[] = [];
      dishorder.forEach((order) => {
        if (!uniqueOrders.find(u => u.dishName === order.dishName)) {
          uniqueOrders.push(order);
        }
      });
      this.dishOrders.set(uniqueOrders); // Actualiza la señal
      this.quantity(); // Llama después de actualizar los datos
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
