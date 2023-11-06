export class Perfil {

    _id?: string;
    role: string;
    status: boolean;

    public constructor(init?: Partial<Perfil>) {
        Object.assign(this, init);
    }
};
