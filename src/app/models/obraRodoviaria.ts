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
    user: any;
    tipo_infraestrutura: any;
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

    public constructor(init?: Partial<ObraRodoviaria>) {
        Object.assign(this, init);
    }
    
};
