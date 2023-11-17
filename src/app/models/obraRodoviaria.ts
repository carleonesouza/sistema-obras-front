import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";

export class ObraRodoviaria implements Obra {

    id: number;
    empreendimento: number;
    tipo: string;
    nomeDaInfraestrutura: string;
    descricao: string;
    intervencao: string;
    status: any;
    instrumento: string;
    dataInicio: string | Date;
    dataConclusao: string | Date;
    documentosAdicionais?: string;
    endereco: Endereco;
    arquivoGeorreferenciado?: string;
    valorGlobal: number;
    percentualFinanceiroExecutado: number;
    rodovia: string;
    kmInicial: number;
    kmFinal: number;
    extensao: number;
    codigo: string;
    versao: string;

    public constructor(init?: Partial<ObraRodoviaria>) {
        Object.assign(this, init);
    }
};
