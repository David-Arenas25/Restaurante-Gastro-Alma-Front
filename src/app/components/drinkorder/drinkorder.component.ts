import { Component, computed, inject, input, signal } from '@angular/core';
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

  filteredOrders = computed(() => 
    this.drinkOrders().filter(order => order.orderId === this.drinkOrderId())
  )
  
  hasOrders = computed(() => this.filteredOrders().length > 0)

  ngOnInit() {  
      this.getAll();      
  }
getAll() {
  this.drinkOrderService.viewDrinkOrders().subscribe({
    next: (drinkOrders) => {
      console.log('Pedidos de bebidas obtenidos:', drinkOrders);
      // Filtra para que solo quede un pedido por drinkName
      const uniqueOrders: DrinkOrderAll[] = [];
      drinkOrders.forEach((order) => {
        if (!uniqueOrders.find(u => u.drinkName === order.drinkName)) {
          uniqueOrders.push(order);
        }
      });
      this.drinkOrders.set(uniqueOrders); // Actualiza la señal
      this.quantity(); // Llama después de actualizar los datos
    },
    error: (err) => {
      console.error('Error al obtener pedidos de bebidas', err);
    }
  });
}


quantity() {
  
  this.drinkOrders().forEach((drinkOrders:DrinkOrderAll) => {
    this.drinkOrderService.quantity(drinkOrders.orderId, drinkOrders.drinkId).subscribe({
      next: (quantity) => {
        drinkOrders.quantity = quantity;
              }
      }
  )})

}


deleteDrinkOrder(orderId:number,drinkId:number){
  this.drinkOrderService.delete(orderId,drinkId).subscribe({
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
