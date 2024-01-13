import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CapacitorSQLite,
  capConnectionOptions,
} from '@capacitor-community/sqlite';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class SQLiteService {
  //private db: any;
  db = CapacitorSQLite;
  private apiUrl = 'http://localhost/ionic_perpus/api.php'; // sesuaikan dengan alamat API Anda
  constructor(private http: HttpClient) {
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    const dbOptions: capConnectionOptions = {
      database: 'testDatabase_2',
      encrypted: false,
      mode: 'no-encryption',
      readonly: false,
    };

    // Use this.db as a reference to CapacitorSQLite for executing queries
    this.db = CapacitorSQLite;
    this.db.createConnection(dbOptions);
    this.db.open({ database: 'testDatabase_2', readonly: false });

    await this.createTable();
  }

  // ==================== CREATE TABLE ====================
  private async createTable(): Promise<void> {
    const queries = [
      `
      CREATE TABLE IF NOT EXISTS buku (
        id_buku INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_buku TEXT NOT NULL,
        pengarang TEXT NOT NULL,
        penerbit TEXT NOT NULL
      )`,

      `CREATE TABLE IF NOT EXISTS peminjaman (
        id_peminjaman INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_peminjam TEXT NOT NULL,
        nama_buku TEXT NOT NULL,
        waktu_peminjaman TEXT NOT NULL,
        waktu_pengembalian TEXT,
        status_peminjaman TEXT NOT NULL
      )`,
    ];

    // Use CapacitorSQLite for running queries
    for (const query of queries) {
      await this.db.run({
        database: 'testDatabase_2',
        statement: query,
        values: [],
      });
    }
  }

  // ==================== CRUD ====================
  async insertBuku(
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ): Promise<void> {
    const query = `INSERT INTO buku (nama_buku, pengarang, penerbit) VALUES (?, ?, ?)`;

    await this.db.run({
      database: 'testDatabase_2',
      statement: query,
      values: [nama_buku, pengarang, penerbit],
    });
  }

  async insertPeminjaman(
    nama_peminjam: string,
    nama_buku: string,
    waktu_peminjaman: string,
    waktu_pengembalian: string,
    status_peminjaman: string
  ): Promise<void> {
    const query = `INSERT INTO peminjaman (nama_peminjam, nama_buku, waktu_peminjaman, waktu_pengembalian, status_peminjaman) VALUES (?, ?, ?, ?, ?)`;

    await this.db.run({
      database: 'testDatabase_2',
      statement: query,
      values: [
        nama_peminjam,
        nama_buku,
        waktu_peminjaman,
        waktu_pengembalian,
        status_peminjaman,
      ],
    });
  }

  async getBuku(): Promise<any[]> {
    const query = 'SELECT * FROM buku';
    const result = await this.db.query({
      database: 'testDatabase_2',
      statement: query,
      values: [],
    });
    return result?.values || [];
  }

  async getPeminjaman(): Promise<any[]> {
    const query = 'SELECT * FROM peminjaman WHERE status_peminjaman = "pinjam"';
    const result = await this.db.query({
      database: 'testDatabase_2',
      statement: query,
      values: [],
    });
    return result?.values || [];
  }

  async getPengembalian(): Promise<any[]> {
    const query =
      'SELECT * FROM peminjaman WHERE status_peminjaman = "kembali"';
    const result = await this.db.query({
      database: 'testDatabase_2',
      statement: query,
      values: [],
    });
    return result?.values || [];
  }

  async updateBuku(
    id_buku: number,
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ): Promise<void> {
    const query =
      'UPDATE buku SET nama_buku = ?, pengarang = ?, penerbit = ? WHERE id_buku = ?';
    await this.db.run({
      database: 'testDatabase_2',
      statement: query,
      values: [nama_buku, pengarang, penerbit, id_buku],
    });
  }

  async updatePeminjamanStatus(
    id_peminjaman: number,
    status_peminjaman: string
  ): Promise<void> {
    const query =
      'UPDATE peminjaman SET status_peminjaman = ? WHERE id_peminjaman = ?';
    await this.db.run({
      database: 'testDatabase_2',
      statement: query,
      values: [(status_peminjaman = 'kembali'), id_peminjaman],
    });
  }

  async deleteBuku(id_buku: number): Promise<void> {
    const query = 'DELETE FROM buku WHERE id_buku = ?';
    await this.db.run({
      database: 'testDatabase_2',
      statement: query,
      values: [id_buku],
    });
  }

  async deletePeminjaman(id_peminjaman: number): Promise<void> {
    const query = 'DELETE FROM peminjaman WHERE id_peminjaman = ?';
    await this.db.run({
      database: 'testDatabase_2',
      statement: query,
      values: [id_peminjaman],
    });
  }

  // ==================== END OF CRUD ====================

  // ==================== SYNCHRONIZATION TO REMOTE API AND SQLITE ====================

  // Sync all local buku to the remote API

  // insert buku to the remote API
  // fungsinya menyinkronkan penambahan data buku ke server
  // setelah data buku ditambahkan ke local storage
  //method ini dipakai di buku.page.ts
  async insertBukuAndSync(
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ) {
    await this.insertBuku(nama_buku, pengarang, penerbit); // Add to local SQLite database
    await this.syncBukuNative(nama_buku, pengarang, penerbit); // Sync with the remote API
  }

  async updateBukuAndSync(
    id_buku: number,
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ) {
    await this.updateBuku(id_buku, nama_buku, pengarang, penerbit); // Add to local SQLite database
    await this.updateBukuNative(id_buku, nama_buku, pengarang, penerbit); // Sync with the remote API
  }

  async deleteBukuAndSync(id_buku: number) {
    await this.deleteBuku(id_buku); // Add to local SQLite database
    await this.deleteBukuNative(id_buku); // Sync with the remote API
  }

  //sync buku ke server
  private async syncBukuNative(
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'insertBuku',
      nama_buku: nama_buku,
      pengarang: pengarang,
      penerbit: penerbit,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing buku value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'POST',
    });

    console.log('Buku synced successfully');
    console.log('response', JSON.stringify(response));
  }

  // private async syncBuku(): Promise<void> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   const buku_pinjam = await this.getBuku(); // Get all local buku

  //   // Send each buku to the API
  //   for (const buku of buku_pinjam) {
  //     let payload = {
  //       nama_buku: buku.nama_buku,
  //       pengarang: buku.pengarang,
  //       penerbit: buku.penerbit,
  //     };
  //     console.log('Syncing buku value:', JSON.stringify(payload));
  //     this.http.post(this.apiUrl, payload, { headers }).subscribe({
  //       complete: () => console.log(this.syncBuku, 'Buku synced successfully'),
  //     });
  //   }
  // }

  // update buku ke server
  private async updateBukuNative(
    id_buku: number,
    nama_buku: string,
    pengarang: string,
    penerbit: string
  ): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'updateBuku',
      id_buku: id_buku,
      nama_buku: nama_buku,
      pengarang: pengarang,
      penerbit: penerbit,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing buku value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'PUT',
    });

    console.log('Buku synced successfully');
    console.log('response', JSON.stringify(response));
  }

  // delete buku ke server
  private async deleteBukuNative(id_buku: number): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'deleteBuku',
      id_buku: id_buku,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing buku value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'DELETE',
    });

    console.log('Buku synced successfully');
    console.log('response', JSON.stringify(response));
  }

  // Sync buku ends here

  // Sync all local peminjaman to the remote API
  // insert peminjaman to the remote API
  async insertPeminjamanAndSync(
    nama_peminjam: string,
    nama_buku: string,
    waktu_peminjaman: string,
    waktu_pengembalian: string,
    status_peminjaman: string
  ) {
    await this.insertPeminjaman(
      nama_peminjam,
      nama_buku,
      waktu_peminjaman,
      waktu_pengembalian,
      status_peminjaman
    ); // Add to local SQLite database
    await this.syncPeminjamanNative(
      nama_peminjam,
      nama_buku,
      waktu_peminjaman,
      waktu_pengembalian,
      status_peminjaman
    ); // Sync with the remote API
  }

  private async syncPeminjamanNative(
    nama_peminjam: string,
    nama_buku: string,
    waktu_peminjaman: string,
    waktu_pengembalian: string,
    status_peminjaman: string
  ): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };
    let payload = {
      type: 'insertPeminjaman',
      nama_peminjam,
      nama_buku,
      waktu_peminjaman,
      waktu_pengembalian,
      status_peminjaman,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing Peminjaman value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'POST',
    });

    console.log('Peminjaman synced successfully');
    console.log('response', JSON.stringify(response));
  }

  async deletePeminjamanAndSync(id_peminjaman: number) {
    await this.deletePeminjaman(id_peminjaman); // Add to local SQLite database
    await this.deletePeminjamanNative(id_peminjaman); // Sync with the remote API
  }

  private async deletePeminjamanNative(id_peminjaman: number): Promise<void> {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'deletePinjam',
      id_peminjaman: id_peminjaman,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing Peminjaman value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'DELETE',
    });

    console.log('Peminjaman synced successfully');
    console.log('response', JSON.stringify(response));
  }

  async updatePeminjamanAndSync(
    id_peminjaman: number,
    status_peminjaman: string
  ) {
    await this.updatePeminjamanStatus(id_peminjaman, status_peminjaman); // Add to local SQLite database
    await this.updatePeminjamanNative(id_peminjaman, status_peminjaman); // Sync with the remote API
  }

  async updatePeminjamanNative(
    id_peminjaman: number,
    status_peminjaman: string
  ) {
    const options = {
      url: this.apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    let payload = {
      type: 'updatePinjam',
      id_peminjaman: id_peminjaman,
      status_peminjaman: status_peminjaman,
    };
    const sendValue = {
      ...options,
      data: payload,
    };
    console.log('Syncing Peminjaman value:', JSON.stringify(payload));
    const response = await CapacitorHttp.request({
      ...sendValue,
      method: 'PUT',
    });

    console.log('Peminjaman synced successfully');
    console.log('response', JSON.stringify(response));
  }
  // private async syncPeminjaman(): Promise<void> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   const peminjaman_pinjam = await this.getPeminjaman(); // Get all local buku

  //   // Send each peminjaman to the API
  //   for (const peminjaman of peminjaman_pinjam) {
  //     let payload = {
  //       nama_peminjam: peminjaman.nama_peminjam,
  //       nama_buku: peminjaman.nama_buku,
  //       waktu_pinjam: peminjaman.waktu_peminjaman,
  //       waktu_pengembalian: peminjaman.waktu_pengembalian,
  //       status_peminjaman: peminjaman.status_peminjaman,
  //     };
  //     console.log('Syncing peminjaman value:', JSON.stringify(payload));
  //     this.http.post(this.apiUrl, payload, { headers }).subscribe({
  //       complete: () =>
  //         console.log(this.syncPeminjaman, 'Peminjaman synced successfully'),
  //     });
  //   }
  // }
  // Sync peminjaman ends here
}
