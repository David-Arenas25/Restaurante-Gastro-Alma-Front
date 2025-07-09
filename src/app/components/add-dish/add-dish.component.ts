import { Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dish } from '../../model/dish.model';
import { DishService } from '../../service/dish.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-dish',
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './add-dish.component.html',
  styleUrl: './add-dish.component.css'
})
export default class AddDishComponent {

   dishService= inject(DishService)

  dishName = new FormControl('')
  dishPrice = new FormControl(0)
  dishDescription = new FormControl('')
  dishes = signal<Dish[]>([])

  ngOnInit(){
    this.getAll()
  }
  saveDish(){
    if(this.dishName.value && this.dishPrice.value && this.dishDescription.value){
    const dish:Dish = {
      dishId: 0,
      dishName: this.dishName.value,
      dishPrice: this.dishPrice.value,
      dishDescription: this.dishDescription.value
    }
    this.dishService.saveDish(dish).subscribe({
      next: () => {
        alert('Dish saved')
        this.getAll()
      }
    })
  }}

  save(dish:Dish){
     this.dishService.saveDish(dish).subscribe({
      next: () => {
        alert('Dish saved')
        this.getAll()
      }
    })
  }
  


  getAll(){
    this.dishService.getAll().subscribe({
      next: (response) => {
        this.dishes.set(response)
      }
    })
  }
}
