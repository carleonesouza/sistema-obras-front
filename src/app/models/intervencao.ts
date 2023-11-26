export class Intervencao {

    id?: string;
    descricao: string;
    setor: any;
    status?: boolean;

    public constructor(init?: Partial<Intervencao>) {
        Object.assign(this, init);
    }
};
