import { Component, computed, inject, signal } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order.model';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DishComponent } from '../dish/dish.component';
import { DrinkComponent } from "../drink/drink.component";
import DrinkorderComponent from '../drinkorder/drinkorder.component';
import { DishorderComponent } from '../dishorder/dishorder.component';
import { WaiterComponent } from '../waiter/waiter.component';
import { filter } from 'rxjs';


@Component({
  selector: 'app-order',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, DishComponent, DrinkComponent,DrinkorderComponent,DishorderComponent,WaiterComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export default class OrderComponent {

  orderService = inject(OrderService)
  orders = signal<Order[]>([])
  activePaymentId:number | null = null
  quantity = new FormControl('')
  order!:Order
  showDishes = false
  showDrinks = false
  showWaiter = false
  oneOrder:Order | null = null
  orderId = new FormControl('')
  state = signal('todos')
  waiterId = new FormControl('')


  ngOnInit(){
    this.getAll()
 
  }
  ngOnChanges(){
    this.getAll()
  }

  getById(orderId:number){
    return this.orderService.getById(orderId).subscribe({
      next: (order) => this.oneOrder = order
    })
  }

  changeFilter(filter:string){
    
    
    if(this.state() === filter){
      this.state.set('todos')
    }else{
      this.state.set(filter)
    }
  }

  saveOrder() {
    if (this.waiterId.valid) {
      const today = new Date()
      const value = this.waiterId.value 
      if (value !== null) {
      const newOrder = {
        orderId: 0,
        orderDate: today,
        total: 0,
        status: 'PENDIENTE',
        waiterId: parseInt(value),
        cambio:0}     
        const getWaiter = this.orderService.save(newOrder).subscribe({     
          next:(order)=>{
            alert('orden guardada '+ order.orderId)
              this.getAll()
            },error:(error)=>{
                alert('error su orden no se guardó'+error)
              }
            }
      )
          } else{
            alert('ingrese id de mesero por favor')
          }   
        }
      }
    
  deleteOrder(orderId:number){
    return this.orderService.delete(orderId).subscribe({
      next: order => {alert('se borro' + orderId)
        this.getAll()

      }
      
    ,error: (error)=>{
      alert('Error al borrar la orden comuníquese con el administrador')
  }})
  }
  

  showingDrinks(orderId:number){
    this.getById(orderId)
    this.showDishes = false
    this.showDrinks = !this.showDrinks
    this.showWaiter = false
  }


  showingDishes(orderId:number){
    this.getById(orderId)
    this.showDishes = !this.showDishes
    this.showDrinks = false
    this.showWaiter = false
  }
  showingWaiters(orderId:number){
    this.getById(orderId)
    this.showDishes = false
    this.showDrinks = false
    this.showWaiter = !this.showWaiter
    
  
  }
 
  getAll() {
    this.orderService.getAll().subscribe({

      next: (value) => {
        this.orders.set(value);
      },
      error: (error) => {
        console.error("Error fetching orders:", error);
      }
    });
  }



  pay(orderId:number){
    if(this.quantity.valid){
      const quantityValue = this.quantity.value
      if(quantityValue !== null){
    this.orderService.pay(parseInt(quantityValue),orderId).subscribe({
      next: (payment) => {console.log('pago correcto')
      this.getAll()
      this.quantity.setValue('')
      }
    })
  }
    }}

  activeOrderPayment(orderId:number){

    if(this.activePaymentId === orderId){
    this.activePaymentId = null
  }else{
    this.activePaymentId = orderId
  }
}

  updatePrice(orderId: number) {

    let idOrderCall = this.orderService.getById(orderId).subscribe({
      next: (order) => {
        this.order = order
      }
    })

    if(this.order.status.toLocaleLowerCase() === 'cambio' || this.order.status.toLocaleLowerCase() === 'pagado' && this.order.total > 0){
      this.order.status = 'pendiente'
    }
    return this.orderService.calculateTotal(orderId).subscribe({
      next: (order) => {

        console.log('orden registrada correctamente')
        this.getAll()
      }

    })
  }
  

  
  filterView() {
    const viewAllCopy = this.orders();
    const stateCopy = this.state();

    if (stateCopy === 'todos') {
      return viewAllCopy;
    }

    if (stateCopy === 'id' && this.orderId.valid) {
      const idValue = this.orderId.value
      if (idValue !== null) {
        const vAllCopy = viewAllCopy.filter(order => order.orderId === parseInt(idValue))
        return vAllCopy;
      }
    }
    if (stateCopy === 'date') {
      const today = new Date().toISOString().slice(0, 10); 
  
      const todayOrders = viewAllCopy.filter(order => {
          return new Date(order.orderDate).toISOString().slice(0, 10) === today;
      });
  
      return todayOrders;
  }
  

  return viewAllCopy



}}

  

 

