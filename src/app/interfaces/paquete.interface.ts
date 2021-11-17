import { Caracteristica } from './caracteristica.interface';
import { Galeria } from './galeria.iterface';
import { Empresa } from './empresa.interface';

export interface Paquete {
    id: number;
    caracteristicas: string;
    galerias: Galeria[];
    empresa: Empresa;
    nombre: string;
    descripcion: string;
    precio_adulto: number;
    precio_nino?: any;
    informacion: string
    portada: string;
    activo: boolean;
    empresa_id: number;
}

