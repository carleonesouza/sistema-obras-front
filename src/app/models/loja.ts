import { Address } from "./address";
import { Empreendimento } from "./empreendimento";
import { Usuario } from "./usuario";

export class Loja {

    _id?: string;
    users?: Array<Usuario>;
    produtos?: Array<Empreendimento>;
    name: string;
    cnpj: string;
    apiKey: string;
    phone: string;
    owner: string;
    address?: Address;
    status: boolean;

    public constructor(init?: Partial<Loja>) {
        Object.assign(this, init);
    }
};
