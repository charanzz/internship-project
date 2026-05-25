import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin';

const routes: Routes = [
  { path: '', component: AdminComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminComponent
  ]
})
export class AdminModule {}