import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PengembalianPageRoutingModule } from './pengembalian-routing.module';

import { PengembalianPage } from './pengembalian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PengembalianPageRoutingModule
  ],
  declarations: [PengembalianPage]
})
export class PengembalianPageModule {}
