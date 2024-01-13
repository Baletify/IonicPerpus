import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeminjamanPageRoutingModule } from './peminjaman-routing.module';

import { PeminjamanPage } from './peminjaman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeminjamanPageRoutingModule
  ],
  declarations: [PeminjamanPage]
})
export class PeminjamanPageModule {}
