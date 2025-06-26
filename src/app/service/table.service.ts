import { Injectable } from '@angular/core';
import { BasehttpService } from './basehttp.service';
import { Table } from '../model/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService extends BasehttpService {

  getAll(){
    return this.http.get<Table[]>(`${this.API_URL}/tables/all`)
  }


}
