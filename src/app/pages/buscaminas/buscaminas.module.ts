import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableroComponent } from './tablero/tablero.component';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionComponent } from './tablero/configuracion/configuracion.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: TableroComponent,
  },
];

@NgModule({
  declarations: [TableroComponent, ConfiguracionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatButtonModule,
  ],
})
export class BuscaminasModule {}
