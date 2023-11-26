export class Status {

    id?: string;
    descricao: string;
    status?: boolean;

    public constructor(init?: Partial<Status>) {
        Object.assign(this, init);
    }
};
