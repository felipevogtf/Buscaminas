import { Component, OnInit } from '@angular/core';
import { Celda } from 'src/models/celda/celda.model';
import { EstadoCelda } from 'src/models/celda/estado-celda.model';
import { EstadoTablero } from 'src/models/tablero/tablero-estado.model';
import { Tablero } from 'src/models/tablero/tablero.model';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss'],
})
export class TableroComponent implements OnInit {
  title = 'buscaminas';

  /** Variables tablero */
  tablero!: Tablero;
  tableroEstado!: EstadoTablero;
  partidaFinalizada!: boolean;

  /** Variables efectos de sonido */
  bubbleSFX!: HTMLAudioElement;
  explosionSFX!: HTMLAudioElement;
  winSFX!: HTMLAudioElement;

  /** Variables enums */
  EstadoCelda = EstadoCelda;

  constructor() {
    this.crearTablero();
    this.iniciarSFX();
  }

  ngOnInit() {
    this.observarEstadoTablero();
  }

  crearTablero(): void {
    this.tablero = new Tablero(10, 10, 10);
    this.tableroEstado = EstadoTablero.Progreso;
    this.partidaFinalizada = false;
    this.observarEstadoTablero();
  }

  iniciarSFX() {
    this.bubbleSFX = new Audio();
    this.bubbleSFX.src = '/assets/sfx/bubble.mp3';
    this.bubbleSFX.load();

    this.explosionSFX = new Audio();
    this.explosionSFX.src = '/assets/sfx/explosion.mp3';
    this.explosionSFX.load();

    this.winSFX = new Audio();
    this.winSFX.src = '/assets/sfx/win.mp3';
    this.winSFX.load();
  }

  observarEstadoTablero(): void {
    this.tablero.estadoTablero.subscribe((estado: EstadoTablero) => {
      if (estado == EstadoTablero.Ganado) {
        this.winSFX.play();
      }

      this.partidaFinalizada = true;
      this.tableroEstado = estado;
    });
  }

  reiniciar(): void {
    this.crearTablero();
  }

  revelarCelda(celda: Celda): void {
    if (!this.partidaFinalizada) {
      if (celda.estado === EstadoCelda.Oculta) {
        if (!celda.esMina) {
          this.bubbleSound();
        } else {
          this.explosionSFX.play();
        }
      }

      this.tablero.revelarCelda(celda);
    }
  }

  obtenerClaseCelda(celda: Celda): string {
    let clase: string = 'celda-normal';

    if (celda.estado === EstadoCelda.Visible) {
      clase = 'celda-visible';
    }

    if (celda.esMina && celda.estado != EstadoCelda.Oculta) {
      clase =
        celda.estado == EstadoCelda.Reventada
          ? 'celda-reventada'
          : 'celda-mina';
    }

    return clase;
  }

  obtenerEmote(): string {
    let icono = '';

    switch (this.tableroEstado) {
      case EstadoTablero.Ganado:
        icono = 'fa-face-grin-stars';
        break;
      case EstadoTablero.Perdido:
        icono = 'fa-face-dizzy';
        break;
      default:
        icono = 'fa-face-smile';
        break;
    }

    return icono;
  }

  bubbleSound(): void {
    let sound = this.bubbleSFX.cloneNode() as HTMLAudioElement;
    sound.play();
  }
}
