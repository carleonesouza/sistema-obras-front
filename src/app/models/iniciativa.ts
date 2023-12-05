
export class Iniciativa {

    id: string;
    nome: string;
    responsavel?: string;
    descricao: string;
    expectativa: string;
    instrumento: string;
    setor: any;
    user: any;
    usuario_que_alterou: any;
    status?: any;

    public constructor(init?: Partial<Iniciativa>) {
        Object.assign(this, init);
    }
};
