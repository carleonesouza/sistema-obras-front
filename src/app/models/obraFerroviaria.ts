import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";

export class ObraFerroviaria implements Obra {

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
    kmInicial: number;
    kmFinal: number;
    extensao: number;
    novaBitola: string;
    novaVelocidade: number;
    produto: string;
    capacidadeDinamica: number;
    
    public constructor(init?: Partial<ObraFerroviaria>) {
        Object.assign(this, init);
    }
   
};
