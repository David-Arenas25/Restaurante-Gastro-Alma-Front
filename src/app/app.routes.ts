import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/order/order.component')
    }
    ,{
        path: 'tables',
        loadComponent: () => import('./components/table/table.component')
    },
      {
        path: 'detail/:slug',
        loadComponent: () =>
         import('./components/order-detail/order-detail.component')
      },
    {
        path: 'orders',
        loadComponent: () => import('./components/order/order.component')
    },{
        path: 'drinkorder',
        loadComponent: () => import('./components/drinkorder/drinkorder.component')
    }
]
