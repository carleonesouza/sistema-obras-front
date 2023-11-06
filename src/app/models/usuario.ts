import { Address } from './address';
import { Perfil } from './perfil';

export class Usuario {

    _id?: string;
    fullName: string;
    email: string;
    phone: string;
    cpfCnpj: string;
    password: string;
    apiKey: string;
    address?: Address;
    profile?: Perfil;
    status: boolean;

    public constructor(init?: Partial<Usuario>) {
        Object.assign(this, init);
    }
};
