import { Subject } from 'rxjs';
import { Celda } from '../celda/celda.model';
import { EstadoCelda } from '../celda/estado-celda.model';
import { EstadoTablero } from './tablero-estado.model';

export class Tablero {
  filas: number;
  columnas: number;
  cantidadMinas: number;
  matriz: Celda[][];
  minas: Celda[];

  estadoTablero: Subject<EstadoTablero>;
  celdasReveladas: number;

  constructor(filas: number, columnas: number, cantidadMinas: number) {
    this.filas = filas;
    this.columnas = columnas;
    this.cantidadMinas = cantidadMinas;
    this.matriz = [];
    this.minas = [];
    this.celdasReveladas = 0;
    this.estadoTablero = new Subject<EstadoTablero>();

    this.construirTablero();
    this.distribuirMinas();
    this.calcularMinasAdyacentes();
  }

  construirTablero(): void {
    for (let i = 0; i < this.filas; i++) {
      let fila: Celda[] = [];
      for (let j = 0; j < this.columnas; j++) {
        fila.push(new Celda(i, j));
      }

      this.matriz.push(fila);
    }
  }

  distribuirMinas(): void {
    let posicionMinas: number[][] = [];

    while (posicionMinas.length < this.cantidadMinas) {
      const x: number = Math.floor(Math.random() * this.filas);
      const y: number = Math.floor(Math.random() * this.columnas);

      if (!posicionMinas.some((obj) => obj[0] === x && obj[1] === y)) {
        posicionMinas.push([x, y]);
      }
    }

    for (const posicion of posicionMinas) {
      const x: number = posicion[0];
      const y: number = posicion[1];
      this.matriz[x][y].colocarMina();
      this.minas.push(this.matriz[x][y]);
    }
  }

  calcularMinasAdyacentes(): void {
    for (let i = 0; i < this.matriz.length; i++) {
      for (let j = 0; j < this.matriz[i].length; j++) {
        if (this.matriz[i][j].esMina) {
          const celdasAdyacentes = this.obtenerCeldasAdyacentes(
            this.matriz[i][j]
          );

          for (const celda of celdasAdyacentes) {
            celda.minasAdyacentes++;
          }
        }
      }
    }
  }

  obtenerCeldasAdyacentes(celda: Celda): Celda[] {
    let celdas: Celda[] = [];
    for (let i = 0; i < 8; i++) {
      let x = celda.posicionX;
      let y = celda.posicionY;

      switch (i) {
        case 0:
          x--;
          break;
        case 1:
          x--;
          y++;
          break;
        case 2:
          y++;
          break;
        case 3:
          x++;
          y++;
          break;
        case 4:
          x++;
          break;
        case 5:
          x++;
          y--;
          break;
        case 6:
          y--;
          break;
        case 7:
          x--;
          y--;
          break;
      }

      if (x >= 0 && x < this.filas && y >= 0 && y < this.columnas) {
        celdas.push(this.matriz[x][y]);
      }
    }

    return celdas;
  }

  revelarCelda(celda: Celda): void {
    if (celda.estado == EstadoCelda.Oculta) {
      this.celdasReveladas++;
    }

    celda.revelar();

    if (celda.esMina) {
      celda.estado = EstadoCelda.Reventada;
      this.revelarMinas();
      this.estadoTablero.next(EstadoTablero.Perdido);
    }

    if (celda.minasAdyacentes == 0 && !celda.esMina) {
      const celdasAdyacentes = this.obtenerCeldasAdyacentes(celda);
      for (const celdaAdyacente of celdasAdyacentes) {
        if (celdaAdyacente.estado === EstadoCelda.Oculta) {
          celdaAdyacente.revelar();
          this.celdasReveladas++;
          this.revelarCelda(celdaAdyacente);
        }
      }
    }

    if (
      this.celdasReveladas ==
      this.filas * this.columnas - this.cantidadMinas
    ) {
      this.estadoTablero.next(EstadoTablero.Ganado);
    }
  }

  revelarMinas(): void {
    for (const mina of this.minas) {
      mina.revelar();
    }
  }
}
