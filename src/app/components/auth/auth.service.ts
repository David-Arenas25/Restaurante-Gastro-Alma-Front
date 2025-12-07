import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = environment.AUTH_URL;

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post(`${this.API}/login`, credentials);
  }
  register(data: { nombreUsuario: string; password: string; roles: string }): Observable<any> {
    return this.http.post(`${this.API}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
