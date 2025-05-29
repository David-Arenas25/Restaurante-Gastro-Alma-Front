import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/order/order.component')
    }
    ,
    {
        path: 'orders',
        loadComponent: () => import('./components/order/order.component')
    },{
        path: 'drinkorder',
        loadComponent: () => import('./components/drinkorder/drinkorder.component')
    }
]
