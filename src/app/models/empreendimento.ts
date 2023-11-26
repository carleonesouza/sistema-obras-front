
export class Empreendimento {

    id?: string;
    nome: string;
    responsavel: string;
    setor: any;
    obras: any;
    user: any;
    usuario_que_alterou: any;
    status: any;

    public constructor(init?: Partial<Empreendimento>) {
        Object.assign(this, init);
    }
};
