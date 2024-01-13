import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeminjamanPage } from './peminjaman.page';

const routes: Routes = [
  {
    path: '',
    component: PeminjamanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeminjamanPageRoutingModule {}
