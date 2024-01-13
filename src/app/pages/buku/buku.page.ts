import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { SQLiteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-buku',
  templateUrl: './buku.page.html',
  styleUrls: ['./buku.page.scss'],
})
export class BukuPage {
  daftar_buku: any[] = [];
  constructor(private sqliteService: SQLiteService) {
    this.loadBuku();
  }

  async loadBuku() {
    this.daftar_buku = await this.sqliteService.getBuku();
    console.log(this.daftar_buku);
  }

  @ViewChild(IonModal)
  modal!: IonModal;
  nama_buku: string = '';
  pengarang: string = '';
  penerbit: string = '';
  selectedIDBuku: any = '';

  cancelInsert() {
    this.modal.dismiss(null, 'cancel');
  }

  confirmInsert() {
    this.modal.dismiss(this.nama_buku, 'confirm');
    const insertBuku = {
      nama_buku: this.nama_buku,
      pengarang: this.pengarang,
      penerbit: this.penerbit,
    };

    if (insertBuku) {
      console.log(
        'Menambahkan Buku: ',
        this.nama_buku,
        ' Pengarang: ',
        this.pengarang,
        ' Penerbit: ',
        this.penerbit
      );
      this.saveBukuAndSync(
        insertBuku.nama_buku,
        insertBuku.pengarang,
        insertBuku.penerbit
      );
    }
  }

  saveBukuAndSync(
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ): void {
    this.sqliteService
      .insertBukuAndSync(nama_buku, pengarang, penerbit)
      .then(() => {
        console.log('Buku added and synced successfully');
        this.loadBuku(); // Memperbarui daftar buku setelah menambahkan buku baru
      })
      .catch((error) => console.error('Error adding and syncing Buku', error));
  }

  // update buku starts here
  cancelUpdate() {
    this.modal.dismiss(this.selectedIDBuku, 'cancel');
  }

  selectBuku(buku: any) {
    this.selectedIDBuku = buku.id_buku;
  }

  confirmUpdate() {
    const updateBuku = {
      id_buku: this.selectedIDBuku,
      nama_buku: this.nama_buku,
      pengarang: this.pengarang,
      penerbit: this.penerbit,
    };

    if (updateBuku) {
      console.log(
        'id_buku: ',
        updateBuku.id_buku,
        'Mengedit Buku: ',
        this.nama_buku,
        ' Mengedit Pengarang: ',
        this.pengarang,
        ' Mengedit Penerbit: ',
        this.penerbit
      );
      this.updateBukuAndSync(
        updateBuku.id_buku,
        updateBuku.nama_buku,
        updateBuku.pengarang,
        updateBuku.penerbit
      );
    }
    this.modal.dismiss(this.selectedIDBuku, 'confirm');
  }

  updateBukuAndSync(
    id_buku: number,
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ): void {
    this.sqliteService
      .updateBukuAndSync(id_buku, nama_buku, pengarang, penerbit)
      .then(() => {
        console.log('Buku updated and synced successfully');
        this.loadBuku(); // Memperbarui daftar buku setelah menambahkan buku baru
      })
      .catch((error) => console.error('Error updated and syncing Buku', error));
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
        const deleteBuku = {
          id_buku: this.selectedIDBuku,
        };

        if (deleteBuku) {
          console.log('id_buku: ', deleteBuku.id_buku);
          this.deleteBukuAndSync(deleteBuku.id_buku);
        }
      },
    },
  ];

  deleteBukuAndSync(id_buku: number): void {
    this.sqliteService
      .deleteBukuAndSync(id_buku)
      .then(() => {
        console.log('Buku deleted and synced successfully');
        this.loadBuku(); // Memperbarui daftar buku setelah menambahkan buku baru
      })
      .catch((error) => console.error('Error deleted and syncing Buku', error));
  }
}
