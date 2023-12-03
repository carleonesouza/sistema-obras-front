export class NaturezaEmpreendimento {

    id?: string;
    descricao: string;
    status?: boolean;

    public constructor(init?: Partial<NaturezaEmpreendimento>) {
        Object.assign(this, init);
    }
};
