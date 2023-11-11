
export class Iniciativa {

    id: string;
    nome: string;
    responsavel?: string;
    ele_principal_afetado: string;
    expectativa: string;
    instrumento: string;
    setor: any;
    usuario: any;
    usuario_alteracao: any;
    status?: number;

    public constructor(init?: Partial<Iniciativa>) {
        Object.assign(this, init);
    }
};
