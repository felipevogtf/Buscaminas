import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NivelTipo } from 'src/models/nivel/nivel-tipo.model';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
})
export class ConfiguracionComponent {
  NivelTipo = NivelTipo;

  constructor(
    public dialogRef: MatDialogRef<ConfiguracionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  seleccionarNivel(nivelTipo: NivelTipo): void {
    this.dialogRef.close(nivelTipo);
  }
}
