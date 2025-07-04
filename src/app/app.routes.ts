import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';


export const routes: Routes = [
   {
    path: '',
    component: LayoutComponent,
    children: [
    {
<<<<<<< Updated upstream
        path: '',
        loadComponent: () => import('./components/order/order.component')
    }
    ,
=======
        path: 'tables',
        loadComponent: () => import('./components/table/table.component')
    },
    {path: 'orders', loadComponent: ()=> import('./components/order/order.component')
    },
    {path: 'detail',loadComponent:() => import ('./components/order-detail/order-detail.component')},
      {
        path: 'detail/:slug',
        loadComponent: () =>
         import('./components/order-detail/order-detail.component')
      },  {
        path: 'orders/:slug',
        loadComponent: () =>
         import('./components/order/order.component')
      },
>>>>>>> Stashed changes
    {
        path: 'drinkorder',
        loadComponent: () => import('./components/drinkorder/drinkorder.component')
    }
    ]}
]
