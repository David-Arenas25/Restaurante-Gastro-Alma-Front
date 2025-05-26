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
      next: (drinkOrders) => { 
        const array:DrinkOrderAll[] = []
        drinkOrders.forEach((drinkOrder) => {
          if(!array.find(order => order.orderId === drinkOrder.orderId && order.drinkId === drinkOrder.drinkId)){
            array.push(drinkOrder)
          }
          
    })
          this.quantity()
          this.drinkOrders.set(array)
          
  }})}


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
