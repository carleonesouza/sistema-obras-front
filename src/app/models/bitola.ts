export class Bitola {

    id?: string;
    descricao: string;

    public constructor(init?: Partial<Bitola>) {
        Object.assign(this, init);
    }
};
