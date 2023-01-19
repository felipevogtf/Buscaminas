import { Subject } from 'rxjs';
import { Celda } from '../celda/celda.model';
import { EstadoCelda } from '../celda/estado-celda.model';
import { EstadoTablero } from './tablero-estado.model';

export class Tablero {
  filas: number = 10;
  columnas: number = 10;
  cantidadMinas: number = 10;
  cantidadBanderas: number = 10;
  matriz: Celda[][];
  minas: Celda[];

  estadoTablero: Subject<EstadoTablero>;
  celdasReveladas: number;
  celdasMarcadas: number;

  constructor(
    filas: number,
    columnas: number,
    cantidadMinas: number,
    cantidadBanderas: number
  ) {
    if (
      this.validarPropiedades(filas, columnas, cantidadMinas, cantidadBanderas)
    ) {
      this.filas = filas;
      this.columnas = columnas;
      this.cantidadMinas = cantidadMinas;
      this.cantidadBanderas = cantidadBanderas;
    }

    this.matriz = [];
    this.minas = [];
    this.celdasReveladas = 0;
    this.celdasMarcadas = 0;
    this.estadoTablero = new Subject<EstadoTablero>();

    this.construirTablero();
    this.distribuirMinas();
    this.calcularMinasAdyacentes();
  }

  /**
   * Validar propiedades de la clase
   * @param filas 
   * @param columnas 
   * @param cantidadMinas 
   * @param cantidadBanderas 
   * @returns 
   */
  validarPropiedades(
    filas: number,
    columnas: number,
    cantidadMinas: number,
    cantidadBanderas: number
  ): boolean {
    let esValido = true;
    
    if (
      filas <= 0 ||
      columnas <= 0 ||
      cantidadMinas <= 0 ||
      cantidadBanderas <= 0 ||
      (cantidadMinas > 0 && cantidadMinas >= filas * columnas)
    ) {
      esValido = false;
    }

    return esValido;
  }

  /**
   * Construir una matriz de celdas
   */
  construirTablero(): void {
    for (let i = 0; i < this.filas; i++) {
      let fila: Celda[] = [];
      for (let j = 0; j < this.columnas; j++) {
        fila.push(new Celda(i, j));
      }

      this.matriz.push(fila);
    }
  }

  /**
   * Crear un array de posiciones para las minas, asignar minas
   * y obtener un array con las celdas de las minas
   */
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

  /**
   * Calcula la cantidad de minas alrededor de una celda
   */
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

  /**
   * Obtener celdas adyacentes (8 celdas maximo)
   * @param celda
   * @returns array con celdas adyacentes
   */
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

  /**
   * Revelar contenido de una celda
   * - Si es mina, se termina la partida y se revelan todas las minas
   * - Si no es mina y no hay minas alrededor, se revela la celda y se recurre a la misma funcion con las celdas adyacentes
   * - Si no es mina y tiene minas alrededor, solo se revela la celda
   * @param celda
   */
  revelarCelda(celda: Celda): void {
    if (celda.estado == EstadoCelda.Oculta) {
      this.celdasReveladas++;
    }

    celda.revelar();

    if (celda.esMina) {
      celda.explotar();
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
      this.desactivarMinas();
      this.estadoTablero.next(EstadoTablero.Ganado);
    }
  }

  /**
   * Revela todas las minas del tablero
   */
  revelarMinas(): void {
    for (const mina of this.minas) {
      if (mina.estado === EstadoCelda.Marcada) {
        mina.revelarMinaMarcada();
      } else {
        mina.revelar();
      }
    }
  }

  /**
   * Marca todas las minas del tablero
   */
  desactivarMinas(): void {
    for (const mina of this.minas) {
      mina.desactivarMina();
    }
  }

  /**
   * Marca una celda
   * @param celda
   */
  marcarCelda(celda: Celda): void {
    if (celda.estado == EstadoCelda.Oculta) {
      this.celdasMarcadas++;
    }

    celda.marcar();
  }

  /**
   * Desmarca una celda
   * @param celda
   */
  desmarcarCelda(celda: Celda): void {
    if (celda.estado == EstadoCelda.Marcada) {
      this.celdasMarcadas--;
    }

    celda.desmarcar();
  }

  /**
   * Obtiene el total de banderas restantes
   * @returns
   */
  obtenerBanderasRestantes(): number {
    return this.cantidadBanderas - this.celdasMarcadas;
  }
}
