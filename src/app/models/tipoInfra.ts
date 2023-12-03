export class TipoInfraestrutura {

    id?: string;
    descricao: string;
    setor: any;
    status?: boolean;

    public constructor(init?: Partial<TipoInfraestrutura>) {
        Object.assign(this, init);
    }
};
