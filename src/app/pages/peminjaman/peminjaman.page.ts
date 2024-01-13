import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { SQLiteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-peminjaman',
  templateUrl: './peminjaman.page.html',
  styleUrls: ['./peminjaman.page.scss'],
})
export class PeminjamanPage {
  daftar_peminjaman: any[] = [];
  daftar_buku: any[] = [];
  constructor(private sqliteService: SQLiteService) {
    this.loadPeminjaman();
    this.loadBuku();
  }

  async loadPeminjaman() {
    this.daftar_peminjaman = await this.sqliteService.getPeminjaman();
    console.log(this.daftar_peminjaman);
  }

  async loadBuku() {
    this.daftar_buku = await this.sqliteService.getBuku();
    console.log(this.daftar_buku);
  }

  trackItems(item: any) {
    return item.id;
  }

  @ViewChild(IonModal)
  modal!: IonModal;
  nama_peminjam: string = '';
  nama_buku: string = '';
  waktu_peminjaman: string = '';
  waktu_pengembalian: string = '';
  status_peminjaman: string = '';
  selectedBuku: any;
  selectedPj: any;

  cancelInsert() {
    this.modal.dismiss(null, 'cancel');
  }

  confirmInsert() {
    this.modal.dismiss(this.nama_buku, 'confirm');
    const insertPeminjaman = {
      nama_peminjam: this.nama_peminjam,
      nama_buku: this.selectedBuku.nama_buku,
      waktu_peminjaman: this.waktu_peminjaman,
      waktu_pengembalian: this.waktu_pengembalian,
      status_peminjaman: this.status_peminjaman,
    };

    if (insertPeminjaman) {
      console.log(
        'Menambahkan Peminjaman dengan nama peminjam: ',
        this.nama_peminjam,
        ' nama buku: ',
        this.selectedBuku.nama_buku,
        ' waktu peminjaman: ',
        this.waktu_peminjaman,
        ' waktu pengembalian: ',
        this.waktu_pengembalian,
        ' status peminjaman: ',
        this.status_peminjaman
      );
      this.savePjAndSync(
        insertPeminjaman.nama_peminjam,
        insertPeminjaman.nama_buku,
        insertPeminjaman.waktu_peminjaman,
        insertPeminjaman.waktu_pengembalian,
        insertPeminjaman.status_peminjaman
      );
    }
  }

  savePjAndSync(
    nama_peminjam: string,
    nama_buku: string,
    waktu_peminjaman: string,
    waktu_pengembalian: string,
    status_peminjaman: string
  ): void {
    this.sqliteService
      .insertPeminjamanAndSync(
        nama_peminjam,
        nama_buku,
        waktu_peminjaman,
        waktu_pengembalian,
        status_peminjaman
      )
      .then(() => {
        console.log('Peminjaman added and synced successfully');
        this.loadPeminjaman(); // Memperbarui daftar Peminjaman setelah menambahkan Peminjaman baru
      })
      .catch((error) =>
        console.error('Error adding and syncing Peminjaman', error)
      );
  }

  selectPj(pj: any) {
    this.selectedPj = pj.id_peminjaman;
  }

  // delete buku starts here

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    },
    {
      text: 'Confirm',
      role: 'confirm',
      handler: () => {
        const deletePeminjaman = {
          id_peminjaman: this.selectedPj,
        };

        if (deletePeminjaman) {
          console.log('id_peminjaman: ', deletePeminjaman.id_peminjaman);
          this.deletePeminjamanAndSync(deletePeminjaman.id_peminjaman);
        }
      },
    },
  ];

  deletePeminjamanAndSync(id_peminjaman: number): void {
    this.sqliteService
      .deletePeminjamanAndSync(id_peminjaman)
      .then(() => {
        console.log('Peminjaman deleted and synced successfully');
        this.loadPeminjaman(); // Memperbarui daftar Peminjaman setelah menghapus Peminjaman baru
      })
      .catch((error) =>
        console.error('Error deleted and syncing Peminjaman', error)
      );
  }

  public alertUpdate = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    },
    {
      text: 'Confirm',
      role: 'confirm',
      handler: () => {
        const updateStatus = {
          id_peminjaman: this.selectedPj,
          status_peminjaman: 'kembali',
        };
        if (updateStatus) {
          console.log('id_peminjaman: ', updateStatus.id_peminjaman);
          this.updatePeminjamanAndSync(
            updateStatus.id_peminjaman,
            updateStatus.status_peminjaman
          );
        }
      },
    },
  ];

  updatePeminjamanAndSync(
    id_peminjaman: number,
    status_peminjaman: string
  ): void {
    this.sqliteService
      .updatePeminjamanAndSync(id_peminjaman, status_peminjaman)
      .then(() => {
        console.log('Peminjaman updated and synced successfully');
        this.loadPeminjaman(); // Memperbarui daftar Peminjaman setelah mengupdate status Peminjaman
      })
      .catch((error) =>
        console.error('Error updated and syncing Peminjaman', error)
      );
  }
}
