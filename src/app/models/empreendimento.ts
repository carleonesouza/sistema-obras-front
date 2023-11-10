
export class Empreendimento {

    id?: string;
    name: string;
    description: string;
    price: number;
    classification: string;
    category: string;
    volume: number;
    quantity: number;
    status: boolean;

    public constructor(init?: Partial<Empreendimento>) {
        Object.assign(this, init);
    }
};
