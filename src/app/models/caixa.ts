import { Venda } from './vendas';

export class Caixa {

    _id: string;
    user: string;
    orders?: Array<Venda>;
    valorAbertura: number;
    valorFechamento: number;
    criadoEm: string;
    fechadoEm: string;
    status?: boolean;

    public constructor(init?: Partial<Caixa>) {
        Object.assign(this, init);
    }
};
