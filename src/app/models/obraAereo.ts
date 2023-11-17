import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";

export class ObraAereo implements Obra {

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
    situacaoAeroporto?: string;
    codigoIATA: string;
    tipoAviaoRecICAO: string;
    novaExtensao: number;
    novaLargura: number;
    novaAreaCriada: number;
        
    public constructor(init?: Partial<ObraAereo>) {
        Object.assign(this, init);
    }
    
};