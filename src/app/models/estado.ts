export class Estado {

    id?: string;
    sigla?: string;
    descricao: string;

    public constructor(init?: Partial<Estado>) {
        Object.assign(this, init);
    }
};
