import { Component, inject, input, signal } from '@angular/core';
import { WaiterService } from '../../service/waiter.service';
import { Waiter } from '../../model/waiter.model';

@Component({
  selector: 'app-waiter',
  standalone: true,
  imports: [],
  templateUrl: './waiter.component.html',
  styleUrl: './waiter.component.css'
})
export default class WaiterComponent {

  waiterService = inject(WaiterService)
  waiters = signal<Waiter[]>([])
  waiterId = input.required<number>()

  ngOnInit(){
    this.getAll()
  }

  getAll(){
    this.waiterService.getAll().subscribe({
      next: (waiters)=> this.waiters.set(waiters)
    })

  }

}

