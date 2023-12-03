import { Obra } from "app/interfaces/obra";
import { Municipio } from "./municipio";
import { Produto } from "./produto";

export class ObraAereo implements Obra {

    id: number;
    empreendimento: any;
    tipo: string;
    user: any;
    tipo_infraestrutura: any;
    descricao: string;
    intervencao: any;
    status: any;
    instrumento: string;
    dataInicio: string | Date;
    dataConclusao: string | Date;
    documentosAdicionais?: string;
    arquivoGeorreferenciado?: string;
    valorGlobal: number;
    percentualFinanceiroExecutado: number;  
    codigoIATA: string;
    tipoAviaoRecICAO: string;
    extensao: number;
    novaLargura: number;
    novaAreaCriada: number;
    usuario_que_alterou: any;
    funcao_estrutura: any;
    responsavel: string;
    sim_nao: any;
    latitude: any;
    longitude: any;
    produtos: Produto[];
    municipios: Municipio[];
    uf: any;
    data_base_orcamento: string | Date;
        
    public constructor(init?: Partial<ObraAereo>) {
        Object.assign(this, init);
    }
    
 
     
};