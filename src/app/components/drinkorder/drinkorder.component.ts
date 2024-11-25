import { Component, inject, input, signal } from '@angular/core';
import { DrinkorderService } from '../../service/drinkorder.service';
import { DrinkOrderAll } from '../../model/drink.order.all.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drinkorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drinkorder.component.html',
  styleUrl: './drinkorder.component.css'
})
export default class DrinkorderComponent {

  drinkOrderService = inject(DrinkorderService)
  drinkOrders = signal<DrinkOrderAll[]>([])
  filterOrders = signal<DrinkOrderAll[]>([])
  quantityValue!:number
  drinkId!:number
  drinkOrderId = input.required<number>()

  ngOnInit() {  
      this.getAll();      
  }

  getAll() {
    this.drinkOrderService.viewDrinkOrders().subscribe({
      next: orders => {
        this.drinkOrders.set(orders);
        this.drinkOrders().forEach(dishOrder => {
          if (dishOrder.idPedido === this.drinkOrderId()) {
            this.quantity(this.drinkOrderId(), dishOrder.idBebida); // Llamada a la función quantity para cada plato
          }
        });
      },
      error: error => console.error('Error:', error)
    });
  }
  


quantity(orderId: number, drinkId: number) {
  this.drinkOrderService.quantity(orderId, drinkId).subscribe({
    next: (quantity) => {
      this.drinkOrders().forEach(element => {
        if (element.idBebida === drinkId) {
          element.quantity = quantity;
           // Aquí asignamos la cantidad a todas las bebidas con el mismo idBebida
        }
      });
    }
  });
}

deleteDrinkOrder(orderId:number){
  this.drinkOrderService.delete(orderId).subscribe({
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
