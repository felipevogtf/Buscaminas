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
    if(this.estado === EstadoCelda.Oculta){
      this.estado = EstadoCelda.Visible;
    }
  }

  marcar(): void {
    this.estado = EstadoCelda.Marcada;
  }

  desmarcar(): void {
    this.estado = EstadoCelda.Oculta;
  }

  explotar(){
    this.estado = EstadoCelda.Reventada;
  }

  revelarMinaMarcada(){
    this.estado = EstadoCelda.MarcadaReventada;
  }

  desactivarMina(){
    this.estado = EstadoCelda.Desactivada;
  }
}
