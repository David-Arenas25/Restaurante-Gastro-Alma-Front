import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';


export const routes: Routes = [
   {
    path: '',
    component: LayoutComponent,
    children: [
    {
        path: 'tables',
        loadComponent: () => import('./components/table/table.component')
    },
    {path: 'orders', loadComponent: ()=> import('./components/order/order.component')
    },
     {path: 'orders/:slug', loadComponent: ()=> import('./components/order/order.component')
    },
    {path: 'detail',loadComponent:() => import ('./components/order-detail/order-detail.component')},
      {
        path: 'detail/:slug',
        loadComponent: () =>
         import('./components/order-detail/order-detail.component')
      },
      {
        path: 'add-drink',
        loadComponent: () => import('./components/add-drink/add-drink.component')
      },
            {
        path: 'add-dish',
        loadComponent: () => import('./components/add-dish/add-dish.component')
      },
       {
        path: 'add-waiter',
        loadComponent: () => import('./components/add-waiter/add-waiter.component')
    },
    {
        path: 'drinkorder',
        loadComponent: () => import('./components/drinkorder/drinkorder.component')
    }, {
        path: 'drinkorder',
        loadComponent: () => import('./components/drinkorder/drinkorder.component')
    },
    {
      path: '**',
      loadComponent: () => import('./components/table/table.component')
    }
    ]}
]
