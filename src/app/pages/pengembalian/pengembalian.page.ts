import { Component } from '@angular/core';
import { SQLiteService } from 'src/app/services/sqlite.service';
@Component({
  selector: 'app-pengembalian',
  templateUrl: './pengembalian.page.html',
  styleUrls: ['./pengembalian.page.scss'],
})
export class PengembalianPage {
  daftar_pengembalian: any[] = [];

  constructor(private sqliteService: SQLiteService) {
    this.loadPengembalian();
  }

  async loadPengembalian() {
    this.daftar_pengembalian = await this.sqliteService.getPengembalian();
    console.log(this.daftar_pengembalian);
  }
}
