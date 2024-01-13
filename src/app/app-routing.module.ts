import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'buku',
    loadChildren: () => import('./pages/buku/buku.module').then( m => m.BukuPageModule)
  },
  {
    path: 'peminjaman',
    loadChildren: () => import('./pages/peminjaman/peminjaman.module').then( m => m.PeminjamanPageModule)
  },
  {
    path: 'pengembalian',
    loadChildren: () => import('./pages/pengembalian/pengembalian.module').then( m => m.PengembalianPageModule)
  },
  {
    path: 'buku',
    loadChildren: () => import('./pages/buku/buku.module').then( m => m.BukuPageModule)
  },
  {
    path: 'peminjaman',
    loadChildren: () => import('./pages/peminjaman/peminjaman.module').then( m => m.PeminjamanPageModule)
  },
  {
    path: 'pengembalian',
    loadChildren: () => import('./pages/pengembalian/pengembalian.module').then( m => m.PengembalianPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
