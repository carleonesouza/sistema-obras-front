export class Perfil {

    id?: string;
    descricao: string;
    status?: boolean;

    public constructor(init?: Partial<Perfil>) {
        Object.assign(this, init);
    }
};
