import { Cesta } from './cesta';
import { Empreendimento } from './empreendimento';
import { Usuario } from './usuario';

export class Venda {

    _id: string;
    produtos: Array<Empreendimento>;
    cestas?: Array<Cesta>;
    nvenda: number;
    total: number;
    formaPagamnto: string;
    troco?: number;
    valorPago: number;
    user: Usuario;
    status?: boolean;

    public constructor(init?: Partial<Venda>) {
        Object.assign(this, init);
    }
};
