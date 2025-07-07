import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AddDrinkComponent } from './components/drink/add-drink/add-drink.component';
import { AddDishComponent } from './components/dish/add-dish/add-dish.component';


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
      {path: 'detail/:slug',
        loadComponent: () =>
         import('./components/order-detail/order-detail.component')
      },
    {
        path: 'drinkorder',
        loadComponent: () => import('./components/drinkorder/drinkorder.component')
    },
    {
        path: '**',
        loadComponent : () => import('./components/order/order.component')
    }
 
    ]}
]
