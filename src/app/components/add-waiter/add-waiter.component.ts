import { Component, inject, signal } from '@angular/core';
import { WaiterService } from '../../service/waiter.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Waiter } from '../../model/waiter.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-waiter',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-waiter.component.html',
  styleUrl: './add-waiter.component.css'
})
export default class AddWaiterComponent {

  waiterService = inject(WaiterService)

  waiterId = new FormControl()
  waiterName = new FormControl('')
  waiterLastName = new FormControl('')
  waiters = signal<Waiter[]>([])
  oneWaiterId = new FormControl(0)
  oneWaiterName = new FormControl('')
  oneWaiterLastName = new FormControl('')
  ngOnInit(){
    this.getAll()
  }
  getAll(){
    this.waiterService.getAll().subscribe({
      next: (response) => {

        this.waiters.set(response)
      }
    })
  }
  saveWaiter(){
   if(this.waiterId.value && this.waiterName.value && this.waiterLastName.value){ 
    const waiter = {
      waiterId: this.waiterId.value,
      waiterName: this.waiterName.value,
      waiterLastName: this.waiterLastName.value
    }
    this.waiterService.save(waiter).subscribe({
      next: (response) => {
        alert('Waiter saved successfully')
        this.getAll()
      }
    })
  }

  }
  save(waiter:Waiter){
    this.waiterService.save(waiter).subscribe({
      next: (response) => {
        alert('Waiter saved successfully')
        this.getAll()
      }
    })
  }
}
