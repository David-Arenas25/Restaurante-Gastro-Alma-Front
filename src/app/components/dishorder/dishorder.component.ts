import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DishorderService } from '../../service/dishorder.service';
import { DishOrderAll } from '../../model/dish.order.all.model';
import { CommonModule } from '@angular/common';
import { DishComponent } from '../dish/dish.component';

@Component({
  selector: 'app-dishorder',
  standalone: true,
  imports: [CommonModule,DishComponent],
  templateUrl: './dishorder.component.html',
  styleUrl: './dishorder.component.css'
})
export class DishorderComponent {
  private dishOrderService = inject(DishorderService);
  dishOrders = signal<DishOrderAll[]>([]);
  orderId= input.required<number>();
  hasOrders = computed(() => this.dishOrders().length > 0)
  deleteOrder = output<string>()
    addOrder = output<string>()



  ngOnInit() {
    this.getAll()

  }
getAll() {
  this.dishOrderService.viewDishOrders().subscribe({
    next: (dishOrders) => {
      const uniqueOrders: DishOrderAll[] = [];

      // Eliminar duplicados por orderId y dishName
      dishOrders.forEach((order) => {
        const alreadyExists = uniqueOrders.some(
          (u) =>
            u.orderId === order.orderId &&
            u.dishName === order.dishName
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
      this.dishOrders.set(filteredOrders);

      // Calcular cantidades u otras acciones
      this.quantity();
    },
    error: (err) => {
      console.error('Error al obtener pedidos de platos', err);
    }
  });
}




quantity() {
  this.dishOrders().forEach((dishOrders:DishOrderAll) => {
    this.dishOrderService.quantity(dishOrders.orderId, dishOrders.dishId).subscribe({
      next: (quantity) => {
        dishOrders.quantity = quantity;
              }
      }
  )})

}

  deleteDrinkOrder(orderId:number,dishId:number){
  this.dishOrderService.delete(orderId,dishId).subscribe({
    next: (deleteOrder) =>{
      // alert('se borro' + deleteOrder)
      this.deletingOrder()
      this.getAll()
    },error: (error)=>{
      // alert("borrado")
      this.getAll()
    }
  })
}
 deletingOrder() {
    this.deleteOrder.emit('borrar');
  }
    emitUpdateOrder(){
    this.addOrder.emit('agregar')
  }
  saveDishOrder(dishId:number){
      this.dishOrderService.save(this.orderId(),dishId,1).subscribe({
        next: (order)=>{
          this.emitUpdateOrder()
          this.getAll()
        },error:(error)=>{
          // alert("error"+error)
          
        }
      })
    }}



