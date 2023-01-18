import { EstadoCelda } from './estado-celda.model';

export class Celda {
  estado: EstadoCelda;
  esMina: boolean;
  minasAdyacentes: number;

  posicionX: number;
  posicionY: number;

  constructor(posicionX: number, posicionY: number) {
    this.estado = EstadoCelda.Oculta;
    this.esMina = false;
    this.minasAdyacentes = 0;

    this.posicionX = posicionX;
    this.posicionY = posicionY;
  }

  colocarMina(): void {
    this.esMina = true;
  }

  revelar(): void {
    if (this.estado == EstadoCelda.Oculta) {
      this.estado = EstadoCelda.Visible;
    }
  }

  marcar(): void {
    if (this.estado == EstadoCelda.Oculta) {
      this.estado = EstadoCelda.Marcada;
    }
  }
}
