import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BukuPage } from './buku.page';

const routes: Routes = [
  {
    path: '',
    component: BukuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BukuPageRoutingModule {}
