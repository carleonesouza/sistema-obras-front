export class Produto {

    id?: string;
    descricao: string;
    status?: boolean;

    public constructor(init?: Partial<Produto>) {
        Object.assign(this, init);
    }
};
