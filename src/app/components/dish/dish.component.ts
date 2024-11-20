import { Component, inject, signal } from '@angular/core';
import { DishService } from '../../service/dish.service';
import { Dish } from '../../model/dish.model';

@Component({
  selector: 'app-dish',
  standalone: true,
  imports: [],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.css'
})
export class DishComponent {

  dishes = signal<Dish[]>([])
  dishService = inject(DishService)

  ngOnInit(){
    this.getAll()
  }

  getAll(){

    this.dishService.getAll().subscribe({
      next: dish=>{
        this.dishes.set(dish)
      }
    })
  }
  

}
