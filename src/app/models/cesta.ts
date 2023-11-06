import { Produto } from './produto';

export class Cesta {

    produto: Produto;
    quantity: number=0;  

    public constructor(init?: Partial<Cesta>) {
        Object.assign(this, init);
    }
};
