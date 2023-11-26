export class TipoInfraestrutura {

    id?: string;
    descricao: string;
    setor_id: any;
    status?: boolean;

    public constructor(init?: Partial<TipoInfraestrutura>) {
        Object.assign(this, init);
    }
};
