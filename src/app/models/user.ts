import { Perfil } from "./perfil";

export class User {

    id?: string;
    nome: string;
    instituicaoSetor: string;
    email: string;
    telefone: string;
    senha?: string;
    profile?: Perfil;
    senha_confirmation: string;
    tipo_usuario_id: string;
    status?: boolean;

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
};