
export class Empreendimento {

    id?: string;
    nome: string;
    responsavel: string;
    respondente: string;
    setor: any;
    obras: any;
    status: any;

    public constructor(init?: Partial<Empreendimento>) {
        Object.assign(this, init);
    }
};
