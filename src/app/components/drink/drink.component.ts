import { Component, inject, signal } from '@angular/core';
import { DrinkService } from '../../service/drink.service';
import { Drink } from '../../model/drink.model';

@Component({
  selector: 'app-drink',
  standalone: true,
  imports: [],
  templateUrl: './drink.component.html',
  styleUrl: './drink.component.css'
})
export class DrinkComponent {

  drinkService = inject(DrinkService)
  drinks = signal<Drink[]>([])

  ngOnInit(){
    this.getAll()
  }

  getAll(){

    this.drinkService.getAll().subscribe({
      next: drink=>{
        this.drinks.set(drink)
      }
    })
  }

}
