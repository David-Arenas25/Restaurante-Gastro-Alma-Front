import { CommonModule, NgClass } from '@angular/common';
import { Component, signal} from '@angular/core';
import { TableService } from '../../service/table.service';
import { Table } from '../../model/table.model';
import OrderComponent from '../order/order.component';
import { RouterLinkWithHref } from '@angular/router';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,RouterLinkWithHref],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export default class TableComponent {
  tables = signal<Table[]>([])
  selectedTable!:number
  showOrdersPanel = true;
  estadoMesa!: string;
  constructor(private readonly tableService: TableService){}
  ngOnInit() {
    this.getAll()
  }
  getAll(){
    return this.tableService.getAll().subscribe({
      next: (data) => {
        this.tables.set(data)
      }
    });
  }

  selectTable(tableId: number){
     this.selectedTable = tableId;
     this.showOrdersPanel = true;
    
  }

  showingPanel(){
    this.showOrdersPanel = false;
  }

 cambiarEstadoMesa(idMesa: number, estadoActual: string): void {
  if(estadoActual === 'disponible'){
    estadoActual = 'ocupado'
  }else if(estadoActual === 'ocupado'){
    estadoActual = 'disponible'
  }
  this.estadoMesa = estadoActual
  this.tableService.cambiarEstadoMesa(idMesa, estadoActual).subscribe({
    next: () => {
      this.getAll(); // Actualiza la lista de mesas
    },
    error: err => {
      console.error('Error al cambiar el estado de la mesa:', err);
    }
  });
}

    }



