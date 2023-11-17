

export class Endereco {
    id?: string;
    logradouro: string;
    municipio: string;
    estado: string;
    longitude?: string;
    latitude?: string

    public constructor(init?: Partial<Endereco>) {
        Object.assign(this, init);
    }
}
