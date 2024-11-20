import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasehttpService {

  API_URL= environment.API_URL
  http = inject(HttpClient);
}
