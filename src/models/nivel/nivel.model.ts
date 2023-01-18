import { NivelTipo } from './nivel-tipo.model';

export interface Nivel {
  dificultad: NivelTipo;
  filas: number;
  columnas: number;
  minas: number;
  banderas: number;
}
