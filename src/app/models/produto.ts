
export class Produto {

    _id?: string;
    name: string;
    description: string;
    price: number;
    classification: string;
    category: string;
    volume: number;
    quantity: number;
    status: boolean;

    public constructor(init?: Partial<Produto>) {
        Object.assign(this, init);
    }
};
