import { NgClass } from '@angular/common';
import { Component, signal} from '@angular/core';
import { TableService } from '../../service/table.service';
import { Table } from '../../model/table.model';
import OrderComponent from '../order/order.component';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgClass,OrderComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export default class TableComponent {
  tables = signal<Table[]>([])
  selectedTable!:number
  showOrdersPanel = true;
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

  showingPanel(showPanel: boolean){
    this.showOrdersPanel = showPanel;
  }
    }



