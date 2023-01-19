import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Celda } from 'src/models/celda/celda.model';
import { EstadoCelda } from 'src/models/celda/estado-celda.model';
import { NivelTipo } from 'src/models/nivel/nivel-tipo.model';
import { EstadoTablero } from 'src/models/tablero/tablero-estado.model';
import { Tablero } from 'src/models/tablero/tablero.model';

import { TableroComponent } from './tablero.component';

describe('TableroComponent', () => {
  let component: TableroComponent;
  let fixture: ComponentFixture<TableroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatButtonModule],
      declarations: [TableroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Creacion de tablero', () => {
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();

    const tableroCreado = component.tablero instanceof Tablero;
    const partinaEnCurso = component.partidaFinalizada == false;

    expect(tableroCreado && partinaEnCurso).toBeTruthy();
  });

  it('Reiniciar tablero', () => {
    component.audioMuted = true;
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();
    component.reiniciar();

    const tableroCreado = component.tablero instanceof Tablero;
    const partinaEnCurso = component.partidaFinalizada == false;

    expect(tableroCreado && partinaEnCurso).toBeTruthy();
  });

  it('Se crea un tablero por defecto al asignarle un nivel invalido', () => {
    component.nivelSeleccionado = NivelTipo.Dificil;
    const nivel = component.cargarNivel();

    nivel.minas = 1000;
    nivel.filas = 3;
    nivel.columnas = 4;
    component.crearTablero();

    const nivelValido = component.tablero.validarPropiedades(
      nivel.filas,
      nivel.columnas,
      nivel.minas,
      nivel.banderas
    );

    const nivelCreadoValido = component.tablero.validarPropiedades(
      component.tablero.filas,
      component.tablero.columnas,
      component.tablero.cantidadMinas,
      component.tablero.cantidadBanderas
    );

    expect(!nivelValido && nivelCreadoValido).toBeTrue();
  });

  it('Minas distribuidas correctamente', () => {
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();

    let contadorMinas = 0;

    for (const fila of component.tablero.matriz) {
      for (const col of fila) {
        if (col.esMina) {
          contadorMinas++;
        }
      }
    }
    const minasDistribuidas = contadorMinas === component.tablero.minas.length;

    expect(minasDistribuidas).toBeTrue();
  });

  it('Verificar contador de minas adyacentes', () => {
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();

    let contador = 0;

    for (const fila of component.tablero.matriz) {
      for (const col of fila) {
        if (col.minasAdyacentes >= 0 && col.minasAdyacentes <= 8) {
          contador++;
        }
      }
    }

    const minasAdyacentes =
      contador === component.tablero.filas * component.tablero.columnas;

    expect(minasAdyacentes).toBeTrue();
  });

  it('Celdas ocultas al iniciar la partida', () => {
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();

    let contadorCeldasOcultas = 0;

    for (const fila of component.tablero.matriz) {
      for (const col of fila) {
        if (col.estado === EstadoCelda.Oculta) {
          contadorCeldasOcultas++;
        }
      }
    }
    const celdasOcultas =
      contadorCeldasOcultas ===
      component.tablero.filas * component.tablero.columnas;

    expect(celdasOcultas).toBeTrue();
  });

  it('No revelar celdas marcadas', () => {
    component.audioMuted = true;
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();

    let testCases: number[][] = [];

    while (testCases.length < 10) {
      const x: number = Math.floor(Math.random() * component.tablero.filas);
      const y: number = Math.floor(Math.random() * component.tablero.columnas);

      if (!testCases.some((obj) => obj[0] === x && obj[1] === y)) {
        testCases.push([x, y]);
      }
    }

    for (const posicion of testCases) {
      const x: number = posicion[0];
      const y: number = posicion[1];
      component.marcarCelda(component.tablero.matriz[x][y]);
    }

    for (const posicion of testCases) {
      const x: number = posicion[0];
      const y: number = posicion[1];
      component.revelarCelda(component.tablero.matriz[x][y]);
    }

    testCases.forEach((posicion) => {
      const x: number = posicion[0];
      const y: number = posicion[1];
      expect(component.tablero.matriz[x][y].estado === EstadoCelda.Marcada).toBeTrue();
    });
  });

  it('Partida termina al revelar todas las celdas', () => {
    component.audioMuted = true;
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();

    for (const fila of component.tablero.matriz) {
      for (const col of fila) {
        if (!col.esMina) {
          component.revelarCelda(col);
        }
      }
    }
    const partidaTerminada = component.partidaFinalizada == true;
    const partidaGanada = component.tableroEstado == EstadoTablero.Ganado;

    expect(partidaTerminada && partidaGanada).toBeTrue();
  });

  it('Partida termina al revelar una mina', () => {
    component.audioMuted = true;
    component.nivelSeleccionado = NivelTipo.Dificil;
    component.crearTablero();

    for (const fila of component.tablero.matriz) {
      for (const col of fila) {
        if (col.esMina) {
          component.revelarCelda(col);
        }
      }
    }
    const partidaTerminada = component.partidaFinalizada == true;
    const partidaGanada = component.tableroEstado == EstadoTablero.Perdido;

    expect(partidaTerminada && partidaGanada).toBeTrue();
  });
});
