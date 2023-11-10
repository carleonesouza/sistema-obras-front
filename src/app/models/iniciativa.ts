import { Setor } from "./setor";
import { User } from "./user";

export class Iniciativa {

    id: string;
    nome: string;
    responsavel?: string;
    ele_principal_afetado: string;
    expectativa: string;
    instrumento: string;
    setor: Setor;
    usuario: User;
    usuario_alteracao: User;
    status?: boolean;

    public constructor(init?: Partial<Iniciativa>) {
        Object.assign(this, init);
    }
};
