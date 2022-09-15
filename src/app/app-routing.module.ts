import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SalaryComponent} from "./components/salary/salary.component";

const routes: Routes = [
  {path: '', component: SalaryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
