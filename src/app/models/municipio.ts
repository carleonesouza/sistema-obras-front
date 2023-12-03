export class Municipio {

    id?: string;
    uf?: string;
    nome: string;

    public constructor(init?: Partial<Municipio>) {
        Object.assign(this, init);
    }
};
