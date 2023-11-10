export class Setor {

    id: string;
    descricao: string;

    public constructor(init?: Partial<Setor>) {
        Object.assign(this, init);
    }
};
