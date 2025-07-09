import { Component, inject, signal } from '@angular/core';
import { DrinkService } from '../../service/drink.service';
import { Drink } from '../../model/drink.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-drink',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-drink.component.html',
  styleUrl: './add-drink.component.css'
})
export default class AddDrinkComponent {
  drinkService = inject(DrinkService)

  drinkName = new FormControl('')
  drinkPrice = new FormControl(0)
  drinkDescription = new FormControl('')

  drinks = signal<Drink[]>([])

  ngOnInit(){
    this.getAll()
  }
  
  saveDrink(){
    if(this.drinkName.value && this.drinkPrice.value && this.drinkDescription.value){
    const drink:Drink = {
      drinkId: 0,
      drinkName: this.drinkName.value,
      drinkPrice: this.drinkPrice.value,
      drinkDescription: this.drinkDescription.value
    }
    this.drinkService.save(drink).subscribe({
      next: () => {
        alert('Drink saved')
        this.getAll()
      }
    })
  }}

     save(drink:Drink){
    this.drinkService.save(drink).subscribe({
      next: (response) => {
        alert('Drink saved successfully')
        this.getAll()
      }
    })
  }

  getAll(){
    this.drinkService.getAll().subscribe({
      next: (response) => {
        this.drinks.set(response)
      }
    })
  }

}
