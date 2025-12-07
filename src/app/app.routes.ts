import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './components/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'tables',
        loadComponent: () => import('./components/table/table.component')
      },
  {
  path: 'orders/:slug',
  loadComponent: () =>
    import('./components/order/order.component'),
  inputs: {
    slug: 'slug'
  }
  }
      {
        path: 'detail',
        loadComponent: () => import('./components/order-detail/order-detail.component')
      },
      {
        path: 'detail/:slug',
        loadComponent: () => import('./components/order-detail/order-detail.component')
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
      },
      {
        path: 'dishorder',
        loadComponent: () => import('./components/dishorder/dishorder.component').then(m => m.DishorderComponent)
      },
      {
        path: 'dish',
        loadComponent: () => import('./components/dish/dish.component').then(m => m.DishComponent)
      },
      {
        path: 'drink',
        loadComponent: () => import('./components/drink/drink.component').then(m => m.DrinkComponent)
      },
      {
        path: 'waiter',
        loadComponent: () => import('./components/waiter/waiter.component')
      },
      {
        path: '',
        redirectTo: 'tables',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
