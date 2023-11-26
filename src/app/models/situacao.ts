export class Situacao {

    id?: string;
    descricao: string;
    setor: any;
    status?: boolean;

    public constructor(init?: Partial<Situacao>) {
        Object.assign(this, init);
    }
};
