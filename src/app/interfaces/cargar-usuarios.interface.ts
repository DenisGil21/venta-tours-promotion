import { Usuario } from '../models/usuario.model';

export interface CargarUsuario {
    data: Usuario[];
    next_page_url: string;
    prev_page_url: string;
}