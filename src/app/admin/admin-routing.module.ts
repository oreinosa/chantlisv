import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { DelUserComponent } from './users/del-user/del-user.component';

import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import { EditCategoryComponent } from './categories/edit-category/edit-category.component';
import { DelCategoryComponent } from './categories/del-category/del-category.component';

import { ProductsComponent } from './products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { DelProductComponent } from './products/del-product/del-product.component';

import { WorkplacesComponent } from './workplaces/workplaces.component';
import { AddWorkplaceComponent } from './workplaces/add-workplace/add-workplace.component';
import { EditWorkplaceComponent } from './workplaces/edit-workplace/edit-workplace.component';
import { DelWorkplaceComponent } from './workplaces/del-workplace/del-workplace.component';

import { MenusComponent } from './menus/menus.component';
import { AddMenuComponent } from './menus/add-menu/add-menu.component';
import { EditMenuComponent } from './menus/edit-menu/edit-menu.component';
import { DelMenuComponent } from './menus/del-menu/del-menu.component';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent, children: [
      {
        path: 'usuarios', component: UsersComponent, 
        children: [
          { path: 'agregar', component: AddUserComponent },
          { path: 'editar/:id', component: EditUserComponent },
          { path: 'borrar/:id', component: DelUserComponent }
        ]
      },
      {
        path: 'categorias', component: CategoriesComponent,
        children: [
          { path: 'agregar', component: AddCategoryComponent },
          { path: 'editar/:id', component: EditCategoryComponent },
          { path: 'borrar/:id', component: DelCategoryComponent }
        ]
      },
      {
        path: 'lugares-de-trabajo', component: WorkplacesComponent,
        children: [
          { path: 'agregar', component: AddWorkplaceComponent },
          { path: 'editar/:id', component: EditWorkplaceComponent },
          { path: 'borrar/:id', component: DelWorkplaceComponent }
        ]
      },
      {
        path: 'productos', component: ProductsComponent,
        children: [
          { path: 'agregar', component: AddProductComponent },
          { path: 'editar/:id', component: EditProductComponent },
          { path: 'borrar/:id', component: DelProductComponent }
        ]
      },
      {
        path: 'menus', component: MenusComponent, 
        children: [
          { path: 'agregar', component: AddMenuComponent },
          { path: 'editar/:id', component: EditMenuComponent },
          { path: 'borrar/:id', component: DelMenuComponent }
        ]
      },
      { path: '', pathMatch: 'full', redirectTo: 'menus' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
