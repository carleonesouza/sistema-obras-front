import { Empreendimento } from './empreendimento';

export class Cesta {

    produto: Empreendimento;
    quantity: number=0;  

    public constructor(init?: Partial<Cesta>) {
        Object.assign(this, init);
    }
};
