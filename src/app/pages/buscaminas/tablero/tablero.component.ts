import { Component, OnInit } from '@angular/core';
import { Celda } from 'src/models/celda/celda.model';
import { EstadoCelda } from 'src/models/celda/estado-celda.model';
import { EstadoTablero } from 'src/models/tablero/tablero-estado.model';
import { Tablero } from 'src/models/tablero/tablero.model';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MatDialog } from '@angular/material/dialog';
import { NivelTipo } from 'src/models/nivel/nivel-tipo.model';
import { Nivel } from 'src/models/nivel/nivel.model';
import { QueryParamsService } from 'src/app/services/query-params.service';

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
  nivelSeleccionado!: NivelTipo;

  /** Variables efectos de sonido */
  bubbleSFX!: HTMLAudioElement;
  explosionSFX!: HTMLAudioElement;
  winSFX!: HTMLAudioElement;
  backgroundSFX!: HTMLAudioElement;
  clickSFX!: HTMLAudioElement;
  audioMuted!: boolean;

  /** Variables enums */
  EstadoCelda = EstadoCelda;

  niveles: Nivel[] = [
    {
      dificultad: NivelTipo.Facil,
      filas: 10,
      columnas: 10,
      minas: 10,
      banderas: 10,
    },
    {
      dificultad: NivelTipo.Intermedio,
      filas: 16,
      columnas: 16,
      minas: 40,
      banderas: 40,
    },
    {
      dificultad: NivelTipo.Dificil,
      filas: 16,
      columnas: 30,
      minas: 99,
      banderas: 99,
    },
  ];

  constructor(
    private dialog: MatDialog,
    private queryParamsService: QueryParamsService,
  ) {
    this.nivelSeleccionado = NivelTipo.Facil;


    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.iniciarSFX();
    }
  }

  ngOnInit() {
    this.queryParamsService.getQueryParams('difficulty').subscribe((param) => {
      try {
        this.nivelSeleccionado = parseInt(param) as NivelTipo;
      } catch (err) {
        this.nivelSeleccionado = NivelTipo.Facil;
      }
    });
    this.crearTablero();
    this.observarEstadoTablero();
    
  }

  /**
   * Inicializar tablero
   */
  crearTablero(): void {
    const nivel: Nivel = this.cargarNivel();

    this.tablero = new Tablero(
      nivel.filas,
      nivel.columnas,
      nivel.minas,
      nivel.banderas,
    );

    this.tableroEstado = EstadoTablero.Progreso;
    this.partidaFinalizada = false;
    this.observarEstadoTablero();
  }

  /**
   * Busca el nivel seleccionado
   * @returns Nivel encontrado
   */
  cargarNivel(): Nivel {
    let nivelIndex: number = 0;

    let existeNivel: boolean = this.niveles.some(
      (nivel) => nivel.dificultad == this.nivelSeleccionado,
    );

    if (existeNivel) {
      nivelIndex = this.niveles.findIndex(
        (nivel) => nivel.dificultad == this.nivelSeleccionado,
      );
    }

    return this.niveles[nivelIndex];
  }

  /**
   * Volver a crear el tablero
   */
  reiniciar(): void {
    this.clickSound();

    this.crearTablero();

    this.backgroundSound();
  }

  /**
   * Iniciar variables para los efectos de sonido
   */
  iniciarSFX() {
    this.audioMuted = false;

    this.bubbleSFX = new Audio();
    this.bubbleSFX.src = 'assets/sfx/bubble.mp3';
    this.bubbleSFX.load();

    this.explosionSFX = new Audio();
    this.explosionSFX.src = 'assets/sfx/explosion.mp3';
    this.explosionSFX.load();
    this.explosionSFX.volume = 0.15;

    this.winSFX = new Audio();
    this.winSFX.src = 'assets/sfx/win.mp3';
    this.winSFX.load();

    // this.backgroundSFX = new Audio();
    // this.backgroundSFX.src = 'assets/sfx/back-loop.mp3';
    // this.backgroundSFX.load();
    // this.backgroundSFX.volume = 0.15;
    // this.backgroundSFX.loop = true;

    this.clickSFX = new Audio();
    this.clickSFX.src = 'assets/sfx/click.mp3';
    this.clickSFX.load();
  }

  /**
   * Observar cuando se termina la partida
   */
  observarEstadoTablero(): void {
    this.tablero.estadoTablero.subscribe((estado: EstadoTablero) => {
      if (estado == EstadoTablero.Ganado) {
        this.windSound();
      }

      this.partidaFinalizada = true;
      this.tableroEstado = estado;
    });
  }

  /**
   * Funcion click para mostar el contenido de una celda
   * @param celda
   */
  revelarCelda(celda: Celda): void {
    if (!this.partidaFinalizada) {
      if (celda.estado === EstadoCelda.Oculta) {
        /* istanbul ignore next */
        if (!celda.esMina) {
          this.bubbleSound();
        } else {
          this.explosionSound();
        }

        this.tablero.revelarCelda(celda);
      }
    }

    this.backgroundSound();
  }

  /**
   * Funcion click para marcar una celda
   * @param celda
   */
  marcarCelda(celda: Celda): void {
    if (!this.partidaFinalizada) {
      this.clickSound();

      if (celda.estado === EstadoCelda.Oculta) {
        this.tablero.marcarCelda(celda);
      } else if (celda.estado === EstadoCelda.Marcada) {
        this.tablero.desmarcarCelda(celda);
      }
    }

    this.backgroundSound();
  }

  /**
   * Obtener una clase css para una celda dependiendo de su estado
   * @param celda
   * @returns string con el nombre de la clase
   */
  obtenerClaseCelda(celda: Celda): string {
    let clase: string = 'celda-normal';

    if (celda.esMina) {
      switch (celda.estado) {
        case EstadoCelda.Reventada:
          clase = 'celda-reventada';
          break;
        case EstadoCelda.Oculta:
          clase = 'celda-normal';
          break;
        case EstadoCelda.Marcada:
          clase = 'celda-normal';
          break;
        case EstadoCelda.MarcadaReventada:
          clase = 'celda-mina-marcada';
          break;
        case EstadoCelda.Desactivada:
          clase = 'celda-mina-desactivada';
          break;
        default:
          clase = 'celda-mina';
          break;
      }
    } else {
      switch (celda.estado) {
        case EstadoCelda.Visible:
          clase = 'celda-visible';
          break;
        default:
          clase = 'celda-normal';
          break;
      }
    }
    return clase;
  }

  /**
   * Obtener el nombre del icono para el boton reiniciar dependiendo del estado de la partida
   * @returns string con el nombre del icono
   */
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

  /**
   * Obtiene la clase para el estado de la partida
   * @returns
   */
  obtenerEstadoPartida(): string {
    let estado = '';

    switch (this.tableroEstado) {
      case EstadoTablero.Ganado:
        estado = 'partida-ganada';
        break;
      case EstadoTablero.Perdido:
        estado = 'partida-perdida';
        break;
      default:
        estado = '';
        break;
    }

    return estado;
  }

  /**
   * Deshabilita el menu del click derecho
   * @param event
   */
  disableClickMenu(event: any): void {
    event.preventDefault();
  }

  /**
   * Mutea/desmutea los efectos de sonido
   */
  toggleMuted() {
    this.audioMuted = !this.audioMuted;

    this.explosionSFX.muted = this.audioMuted;
    this.winSFX.muted = this.audioMuted;
    this.backgroundSFX.muted = this.audioMuted;

    this.backgroundSound();
  }

  /**
   * Abre modal de configuracion
   */
  abrirConfiguracion() {
    this.clickSound();

    let dialogRef = this.dialog
      .open(ConfiguracionComponent, {
        height: '400px',
        width: '600px',
      })
      .afterClosed()
      .subscribe((data: NivelTipo) => {
        if (Object.values(NivelTipo).includes(data)) {
          this.nivelSeleccionado = data;
          this.queryParamsService.setQueryParam('difficulty', data.toString());
          this.reiniciar();
        }
      });
  }

  /**
   * Reproducir copia del nodo del audio (para sobreponer sonidos)
   */
  bubbleSound(): void {
    let sound = this.bubbleSFX.cloneNode() as HTMLAudioElement;
    sound.muted = this.audioMuted;
    /* istanbul ignore next */

    if (!this.audioMuted) {
      sound.play();
    }
  }

  /**
   * Reproducir sonido
   */
  backgroundSound() {
    if (!this.backgroundSFX) {
      return;
    }
    if (!this.audioMuted) {
      this.backgroundSFX.play();
    }
  }

  /**
   * Reproducir sonido
   */
  windSound() {
    if (!this.audioMuted) {
      this.winSFX.play();
    }
  }

  /**
   * Reproducir sonido
   */
  explosionSound() {
    if (!this.audioMuted) {
      this.explosionSFX.play();
    }
  }

  /**
   * Reproducir copia del nodo del audio (para sobreponer sonidos)
   */
  clickSound(): void {
    let sound = this.clickSFX.cloneNode() as HTMLAudioElement;
    sound.muted = this.audioMuted;
    if (!this.audioMuted) {
      sound.play();
    }
  }
}
