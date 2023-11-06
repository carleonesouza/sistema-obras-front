export class Categoria {

    _id: string;
    name: string;
    description?: string;
    status?: boolean;

    public constructor(init?: Partial<Categoria>) {
        Object.assign(this, init);
    }
};
