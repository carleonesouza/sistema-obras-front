import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";

export class ObraAereo implements Obra {

    id: number;
    empreendimento: any;
    tipo: string;
    user: any;
    tipo_infraestrutura: any;
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
    codigoIATA: string;
    tipoAviaoRecICAO: string;
    extensao: number;
    novaLargura: number;
    novaAreaCriada: number;
    produto: any;
    usuario_que_alterou: any;
    funcao_estrutura: any;
    situacao: any;
    sim_nao: any;
    latitude: any;
    longitude: any;
    municipio: any;
    uf: any;
    data_base_orcamento: string | Date;
        
    public constructor(init?: Partial<ObraAereo>) {
        Object.assign(this, init);
    }
 
     
};